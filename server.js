const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. Database Connection (MongoDB Example)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blexy_college';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

// 2. Define User Database Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Stores the encrypted hash, never plaintext
    role: { type: String, enum: ['Admin', 'Trainer', 'Student'], required: true },
    module: { type: String },
    feeStatus: { type: String, default: 'Pending' }
});

const User = mongoose.model('User', userSchema);

// 3. Register Route (Secure Password Hashing)
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role, module } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // Hash the password securely using bcrypt (10 salt rounds)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            module
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// 4. Login Route (Password Verification)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user by email and role
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials or role.' });
        }

        // Compare the submitted plaintext password with the stored secure hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        // Return successful login info (excluding password hash)
        res.json({
            message: 'Login successful!',
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});