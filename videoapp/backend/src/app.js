const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Sadece video dosyaları yüklenebilir!'));
  }
});

app.post('/api/videos/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Video dosyası gerekli' });

    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `videos/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const result = await s3.upload(params).promise();

    res.status(201).json({
      message: 'Video yüklendi',
      url: result.Location,
      key: result.Key,
      title: req.body.title || req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    console.error('Upload hatası:', err);
    res.status(500).json({ message: 'Yükleme hatası', error: err.message });
  }
});

app.get('/api/videos', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: 'videos/',
    };

    const result = await s3.listObjectsV2(params).promise();
    const videos = result.Contents.filter(item => item.Key !== 'videos/').map(item => ({
      key: item.Key,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified,
      title: item.Key.replace('videos/', ''),
    }));

    res.json(videos);
  } catch (err) {
    console.error('S3 Hatası:', err);
    res.status(500).json({ message: 'Listeleme hatası', error: err.message });
  }
});

app.delete('/api/videos/:key', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.params.key,
    };
    await s3.deleteObject(params).promise();
    res.json({ message: 'Video silindi' });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ message: 'Silme hatası', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Video API çalışıyor!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Video sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});