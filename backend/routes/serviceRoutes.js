const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/category/:catName', async (req, res) => {
    try {
        const services = await Service.find({ category: req.params.catName });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;