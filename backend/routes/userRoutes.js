const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken, checkRole } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, email, role, fullName, phone, createdAt FROM users ORDER BY createdAt DESC'
    );
    res.json({ data: users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get users by role
router.get('/role/:role', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { role } = req.params;
    const [users] = await pool.query(
      'SELECT id, email, role, fullName, phone, createdAt FROM users WHERE role = ? ORDER BY createdAt DESC',
      [role]
    );
    res.json({ data: users });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user
router.get('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query(
      'SELECT id, email, role, fullName, phone, createdAt FROM users WHERE id = ?',
      [id]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user (admin only)
router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { email, password, role, fullName, phone } = req.body;

    if (!email || !password || !role || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, role, fullName, phone) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, role, fullName, phone || '']
    );

    res.status(201).json({
      message: 'User created successfully',
      data: { id: result.insertId, email, role, fullName, phone }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, role } = req.body;

    await pool.query(
      'UPDATE users SET fullName = ?, phone = ?, role = ? WHERE id = ?',
      [fullName, phone, role, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;