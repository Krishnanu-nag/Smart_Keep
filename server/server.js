require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/user'); // your user schema

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // your Vite frontend
  credentials: true
}));
app.use(express.json());




// Middleware to verify JWT token and set req.user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = userPayload; // contains id, email from sign-in token
    next();
  });
};

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});





// Protected route to get current logged-in user info
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v'); // exclude sensitive info
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error in /api/me:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Register route
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists by email OR name to avoid unique key errors
    let existingUser = await User.findOne({
      $or: [{ email }, { name }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Name already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in /api/register:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Login route with JWT
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error in /api/login:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/google-login", async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Optional: update info if changed
      user.name = name;
      user.picture = picture;
      await user.save();
    } else {
      user = await User.create({ name, email, googleId, picture });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, picture: user.picture },
    });
  } catch (err) {
    console.error('Error in /api/google-login:', err);
    res.status(401).json({ message: "Google authentication failed" });
  }
});

// Server start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
