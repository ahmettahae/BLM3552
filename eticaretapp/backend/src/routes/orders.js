const express = require('express');
const authMiddleware = require('../middleware/auth');
const { Order, OrderItem, Product } = require('../models');
const { carts } = require('./cart');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { address, items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'Sepet boş' });

    let total = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ message: `Ürün bulunamadı` });
      total += product.price * item.quantity;
    }

    const order = await Order.create({ userId: req.user.id, total, address });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
      await product.update({ stock: product.stock - item.quantity });
    }

    if (carts[req.user.id]) carts[req.user.id] = [];

    res.status(201).json({ message: 'Sipariş oluşturuldu', orderId: order.id });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem }],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem }],
    });
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    if (order.userId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Yetkisiz' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    if (order.userId !== req.user.id) return res.status(403).json({ message: 'Yetkisiz' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Bu sipariş iptal edilemez' });
    await order.update({ status: 'cancelled' });
    res.json({ message: 'Sipariş iptal edildi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

module.exports = router;