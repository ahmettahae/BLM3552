const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const deviceData = {
  temperature: [],
  humidity: [],
  traffic: [],
  airQuality: [],
  energy: [],
};

setInterval(() => {
  const now = new Date().toISOString();
  
  deviceData.temperature.push({ time: now, value: (18 + Math.random() * 15).toFixed(1) });
  deviceData.humidity.push({ time: now, value: (40 + Math.random() * 40).toFixed(1) });
  deviceData.traffic.push({ time: now, value: Math.floor(Math.random() * 100) });
  deviceData.airQuality.push({ time: now, value: (50 + Math.random() * 100).toFixed(1) });
  deviceData.energy.push({ time: now, value: (100 + Math.random() * 200).toFixed(1) });

  Object.keys(deviceData).forEach(key => {
    if (deviceData[key].length > 20) deviceData[key].shift();
  });

  const payload = JSON.stringify({
    type: 'update',
    data: {
      temperature: deviceData.temperature[deviceData.temperature.length - 1],
      humidity: deviceData.humidity[deviceData.humidity.length - 1],
      traffic: deviceData.traffic[deviceData.traffic.length - 1],
      airQuality: deviceData.airQuality[deviceData.airQuality.length - 1],
      energy: deviceData.energy[deviceData.energy.length - 1],
    }
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}, 3000);

app.get('/', (req, res) => {
  res.json({ message: 'Akıllı Şehir API çalışıyor!' });
});

app.get('/api/devices', (req, res) => {
  res.json({
    devices: [
      { id: 1, name: 'Sıcaklık Sensörü', type: 'temperature', location: 'Merkez', status: 'active' },
      { id: 2, name: 'Nem Sensörü', type: 'humidity', location: 'Park', status: 'active' },
      { id: 3, name: 'Trafik Sensörü', type: 'traffic', location: 'Ana Cadde', status: 'active' },
      { id: 4, name: 'Hava Kalitesi', type: 'airQuality', location: 'Sanayi', status: 'active' },
      { id: 5, name: 'Enerji Sayacı', type: 'energy', location: 'Belediye', status: 'active' },
    ]
  });
});

app.get('/api/data/:type', (req, res) => {
  const { type } = req.params;
  if (!deviceData[type]) return res.status(404).json({ message: 'Cihaz bulunamadı' });
  res.json(deviceData[type]);
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    temperature: deviceData.temperature[deviceData.temperature.length - 1],
    humidity: deviceData.humidity[deviceData.humidity.length - 1],
    traffic: deviceData.traffic[deviceData.traffic.length - 1],
    airQuality: deviceData.airQuality[deviceData.airQuality.length - 1],
    energy: deviceData.energy[deviceData.energy.length - 1],
  });
});

wss.on('connection', (ws) => {
  console.log('Yeni WebSocket bağlantısı');
  ws.send(JSON.stringify({ type: 'connected', message: 'Akıllı Şehir sistemine bağlandınız!' }));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Akıllı Şehir sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});