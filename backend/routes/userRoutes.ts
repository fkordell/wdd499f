import express from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import User from '../models/User';

const router = express.Router();

router.post(
    '/create', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({email});
            if (user) {
                return res.status(200).json({message: 'User already exists, please use another email.'});
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({email, password: hashedPassword});

            await user.save();
            res.status(201).json({message: 'Your account was successfully created.'});
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({message: 'Error creating your account, please try again.'})
        }
});
export default router;