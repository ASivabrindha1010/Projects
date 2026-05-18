const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const newUser = new User({
            username,
            email,
            password,
            role: 'user',
            loyaltyPoints: 0
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error in registration", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: "Invalid Email" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        res.status(200).json({ 
            message: "Login Success", 
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role || 'user',
                loyaltyPoints: user.loyaltyPoints
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;