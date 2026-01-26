const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Login admin user
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password using the method from schema
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: "7d" }
    );

    res.json({ token, message: "Login successful" });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Register admin user (for development/setup)
 * POST /api/auth/register
 * Body: { email, password }
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const admin = new Admin({ email, password });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "Server error" });
  }
};
