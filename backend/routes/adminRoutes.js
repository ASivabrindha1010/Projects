const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const User = require('../models/User');

router.get('/all-bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/all-orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalOrders = await Order.countDocuments();
        res.status(200).json({ totalUsers, totalBookings, totalOrders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;