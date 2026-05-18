const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loyaltyPoints: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);













// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
// });

// module.exports = mongoose.model('User', userSchema);