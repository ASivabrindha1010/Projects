const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userOrders = await Order.find({ userId }).sort({ date: -1 });
    res.status(200).json(userOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { userId, productId, price, quantity } = req.body;

    const newOrder = new Order(req.body);
    await newOrder.save();

    const earnedPoints = Math.floor(price / 100) * 5;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: earnedPoints } },
      { returnDocument: 'after' }
    );

    if (productId) {
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } },
        { returnDocument: 'after' }
      );
    }

    res.status(201).json({
      message: "Order placed and stock updated successfully",
      order: newOrder,
      totalPoints: updatedUser ? updatedUser.loyaltyPoints : 0
    });
  } catch (err) {
    res.status(500).json({ error: "Order failed", details: err.message });
  }
});

module.exports = router;