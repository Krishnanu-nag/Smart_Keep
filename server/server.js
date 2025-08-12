require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require("google-auth-library");



const connectDB = require('./config/db');
const User = require('./models/user');
const Group = require('./models/group');

const http = require('http');
const url = require('url');
const WebSocket = require('ws');


connectDB();

const app = express();

// Middleware
app.use(cors({
  credentials: true
}));
app.use(express.json());

// JWT Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = userPayload; // contains id, email
    next();
  });
};

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// ✅ Get current logged-in user
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in /api/me:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
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

// ✅ Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
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

// ✅ Google Login
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


// ===================== GROUP ROUTES ===================== //

// ✅ Get all groups for logged-in user
app.get('/api/groups/my-groups', authenticateToken, async (req, res) => {
  try {
    const groups = await Group.find({ 'members.userId': req.user.id });
    res.json(Array.isArray(groups) ? groups : []);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json([]);
  }
});

// ✅ Create group
app.post('/api/groups', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Group name is required' });

  try {
    const inviteCode = uuidv4();
    const group = new Group({
      name,
      createdBy: req.user.id,
      members: [{ userId: req.user.id, role: 'admin' }],
      inviteLink: inviteCode
    });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Join group via invite code
app.post('/api/groups/join/:inviteCode', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findOne({ inviteLink: req.params.inviteCode });
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const alreadyMember = group.members.some(
      member => member.userId.toString() === req.user.id
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    group.members.push({ userId: req.user.id, role: 'member' });
    await group.save();

    res.json({ message: 'Joined group successfully', group });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get single group with members
app.get('/api/groups/:groupId', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('members.userId', 'name email picture');

    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some(
      m => m.userId._id.toString() === req.user.id
    );
    if (!isMember) return res.status(403).json({ message: 'Not a member of this group' });

    res.json(group);
  } catch (error) {
    console.error('Error fetching group details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



const server = http.createServer(app);

// --- Setup WebSocket server ---
const wss = new WebSocket.Server({ server });

// Map to track clients by groupId
const clientsByGroup = new Map();

wss.on('connection', (ws, req) => {
  // Parse groupId from query string
  const parameters = url.parse(req.url, true);
  const groupId = parameters.query.groupId;

  if (!groupId) {
    ws.close(1008, 'Missing groupId');
    return;
  }

  // Add client to the group set
  if (!clientsByGroup.has(groupId)) {
    clientsByGroup.set(groupId, new Set());
  }
  clientsByGroup.get(groupId).add(ws);

  console.log(`Client connected to group: ${groupId}`);

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // Validate message structure
      if (!data.groupId || !data.username || !data.text) {
        console.error('Invalid message data', data);
        return;
      }

      // Optional: Save message to DB (if you have a Message model)
      const msgDoc = new Message({
        groupId: data.groupId,
        username: data.username,
        text: data.text,
        createdAt: data.createdAt || new Date(),
      });
      await msgDoc.save();

      // Broadcast only to clients in the same group
      const groupClients = clientsByGroup.get(data.groupId);
      if (groupClients) {
        groupClients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (err) {
      console.error('Error processing WS message:', err);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected from group: ${groupId}`);
    const groupClients = clientsByGroup.get(groupId);
    if (groupClients) {
      groupClients.delete(ws);
      if (groupClients.size === 0) {
        clientsByGroup.delete(groupId);
      }
    }
  });
});



// In your backend (Express)
const Message = require('./models/Message');  // Add this import

app.get('/api/groups/:groupId/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);  // This will print error on server console
    res.status(500).json({ message: 'Server error' });
  }
});









// ===================== START SERVER ===================== //
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server running on port ${PORT}`);
});
