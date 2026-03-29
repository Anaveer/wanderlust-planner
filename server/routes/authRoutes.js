const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Aapka User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER ROUTE (Naya account banana)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists with this email" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(200).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// 2. LOGIN ROUTE (Login karna aur Token bhejna)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Token ban banana
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        // YAHAN THI GALTI: Humein exact 'token' aur 'user' object bhejna hai jo React expect kar raha hai
        res.status(200).json({ 
            token: token, 
            user: { id: user.id, name: user.name, email: user.email } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = router;