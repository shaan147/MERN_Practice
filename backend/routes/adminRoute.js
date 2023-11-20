const express = require('express');
const router = express.Router();
const passport = require('passport');
const Admin = require('../models/admin');

const { isAdmin } = require('../middleware/isAdmin');

// Admin Signup
router.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const foundUser = await Admin.findOne({ username });
    if (foundUser) {
      return res.status(400).json({ error: 'Email already in use. Try a different Email or Login instead.' });
    }

    const admin = new Admin({ ...req.body });
    await Admin.register(admin, password);

    // Authenticate the admin
    passport.authenticate('admin')(req, res, () => {
      // If needed, perform additional actions after successful signup
      res.status(201).json({ message: 'Admin signup successful!' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin Login
router.post('/admin/login', passport.authenticate('admin', {
  failureFlash: { type: 'error', message: 'Invalid Username/Password' }
}), (req, res) => {

  res.status(200).json({ message: 'Admin login successful!' });
});

module.exports = router;
