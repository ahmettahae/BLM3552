const express = require('express');
const { Product } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = {};
    if (category) where.category = category;
    if (search) where.name = { [Op.like]: `%${search}%` };
    const products = await Product.findAll({ where });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz' });
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz' });
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz' });
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    await product.destroy();
    res.json({ message: 'Ürün silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

module.exports = router;