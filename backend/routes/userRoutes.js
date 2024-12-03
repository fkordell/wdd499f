const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Stripe = require('stripe');

require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.get('/profile/:email', async (req, res) => {
  try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const formattedAddress = user.address
            ? `${user.address.line1 || ''}, ${user.address.city || ''}, ${user.address.state || ''}, ${user.address.country || ''}`
            : null;
            
      res.status(200).json({
          name: user.name || null,
          email: user.email,
          address: user.address || null,
          country: user.country || null,
          phone: user.phone || null,
      });
  } catch (error) {
      console.error('Error fetching user profile:', error.message);
      res.status(500).json({ message: 'Error fetching user profile' });
  }
});

router.post('/create', async (req, res) => {
    console.log('Incoming request data:', req.body);

    const { email, name, authProvider = 'local', password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(200).json({ message: 'User already exists.' });
      }

      const stripeCustomer = await stripe.customers.create({
        email,
        name: name || 'Unkown User',
      });

      const newUser = new User({
        email,
        name: name || 'Uknown User',
        authProvider,
        stripeCustomerId: stripeCustomer.id,
        ...(authProvider === 'local' && password && { password }),
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
