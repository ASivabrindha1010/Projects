const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    default: 'Pending'
  },
  receiptId: {
    type: String
  }
});

module.exports = mongoose.model('Order', orderSchema);