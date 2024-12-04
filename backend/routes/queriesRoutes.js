const express = require('express');
const nodemailer = require('nodemailer');
const Query = require('../models/Query');
require('dotenv').config();

const router = express.Router();

router.post('/submit', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    try {
        const newQuery = new Query({ name, email, phone, subject, message });
        await newQuery.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = { 
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subjject: `New Query: ${subject}`,
            text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Message: ${message}
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Query submitted successfully'});
    } catch (error) {
        console.error('Error submitting query:', error.message);
        res.status(500).json({ message: 'Error submitting query'});
    }
});

module.exports = router;