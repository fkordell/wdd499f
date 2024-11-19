const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/create',
  async (req, res) => {
    console.log('Incoming request data:', req.body);

    const { email, name, authProvider = 'local', password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(200).json({ message: 'User already exists.' });
      }

      const newUser = new User({
        email,
        name,
        authProvider,
        ...(authProvider === 'local' && { password }),
      });

      await newUser.save();
      res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user.' });
    }
  }
);


module.exports = router;
