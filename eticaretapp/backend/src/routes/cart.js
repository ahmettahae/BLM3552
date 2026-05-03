const express = require('express');
const authMiddleware = require('../middleware/auth');
const { Product } = require('../models');
const router = express.Router();

const carts = {};

router.get('/', authMiddleware, (req, res) => {
  res.json(carts[req.user.id] || []);
});

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Stok yetersiz' });

    if (!carts[req.user.id]) carts[req.user.id] = [];
    const cart = carts[req.user.id];
    const existing = cart.find(i => i.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, name: product.name, price: product.price, quantity });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.delete('/remove/:productId', authMiddleware, (req, res) => {
  if (!carts[req.user.id]) return res.json([]);
  carts[req.user.id] = carts[req.user.id].filter(i => i.productId !== req.params.productId);
  res.json(carts[req.user.id]);
});

router.delete('/clear', authMiddleware, (req, res) => {
  carts[req.user.id] = [];
  res.json({ message: 'Sepet temizlendi' });
});

module.exports = { router, carts };