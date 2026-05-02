const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const { router: cartRoutes } = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.json({ message: 'E-Ticaret API çalışıyor!' });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log('Veritabanı bağlantısı başarılı!');
  app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  });
}).catch(err => {
  console.error('Veritabanı hatası:', err.message);
});