const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String }, 
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String },
    description: { type: String } 
});

module.exports = mongoose.model('Product', productSchema, 'services');