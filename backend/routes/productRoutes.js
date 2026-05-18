const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/all-products', async (req, res) => {
    try {
        const products = await Product.find(); 
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});

router.get('/category/:categoryName', async (req, res) => {
    try {
        const name = req.params.categoryName;
        const services = await Product.find({ 
            category: { $regex: new RegExp("^" + name + "$", "i") } 
        });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error });
    }
});

router.post('/add', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Item added successfully", newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding item", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Product.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
});

router.post('/buy', async (req, res) => {
    const { productId, qty } = req.body;
    try {
        const item = await Product.findById(productId);
        if (!item) return res.status(404).json({ message: "Product not found" });

        if (item.stock >= qty) {
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { $inc: { stock: -qty } },
                { new: true }
            );
            res.status(200).json({ message: "Product Purchased Successfully!", stock: updatedProduct.stock });
        } else {
            res.status(400).json({ message: "Out of stock!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Transaction failed", error });
    }
});

router.put('/update-stock', async (req, res) => {
    const { productId, newStock } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            { stock: newStock }, 
            { new: true } 
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Stock updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating stock", error });
    }
});

module.exports = router;