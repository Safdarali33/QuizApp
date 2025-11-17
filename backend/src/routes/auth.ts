import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { auth } from '../middleware/auth';

const router = express.Router();

// Debug endpoint to check cookies and headers
router.get('/debug', (req, res) => {
  console.log('🔍 Debug - Cookies received:', req.cookies);
  console.log('🔍 Debug - Headers:', {
    cookie: req.headers.cookie,
    authorization: req.headers.authorization,
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent']
  });
  
  res.json({
    cookiesReceived: req.cookies,
    hasToken: !!req.cookies?.token,
    headers: {
      cookie: req.headers.cookie,
      authorization: req.headers.authorization,
      origin: req.headers.origin
    },
    message: 'Debug endpoint working'
  });
});

// Debug endpoint to check auth status
router.get('/debug-auth', auth, (req, res) => {
  res.json({
    authenticated: true,
    adminId: req.adminId,
    message: 'Auth is working!'
  });
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('🔄 Registration attempt:', { email: req.body.email, name: req.body.name });

    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if JWT secret is available
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Create admin
    const admin = new Admin({ email, password, name });
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie with cross-origin settings
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Must be true for HTTPS
      sameSite: 'none', // Required for cross-origin
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log('✅ Cookie set with sameSite: none, secure: true');
    console.log('✅ Admin registered successfully:', admin.email);

    // Also return token in response body as backup
    res.status(201).json({
      message: 'Admin registered successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      },
      token: token // Return token in response as backup
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔄 Login attempt:', { email: req.body.email });

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if JWT secret is available
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('❌ Admin not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie with cross-origin settings
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Must be true for HTTPS
      sameSite: 'none', // Required for cross-origin
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log('✅ Cookie set with sameSite: none, secure: true');
    console.log('✅ Login successful for:', admin.email);

    // Also return token in response body as backup
    res.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      },
      token: token // Return token in response as backup
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  console.log('🔄 Logout request');
  
  // Clear the cookie with same settings used for setting
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
  
  res.json({ message: 'Logout successful' });
});

// Get current admin
router.get('/me', auth, async (req, res) => {
  try {
    console.log('🔄 Get me request for admin:', req.adminId);
    
    const admin = await Admin.findById(req.adminId).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    console.log('✅ Get me successful:', admin.email);
    res.json({ admin });
  } catch (error) {
    console.error('❌ Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;