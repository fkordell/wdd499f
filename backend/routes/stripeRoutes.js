const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser')
const User = require('../models/User')

require('dotenv').config();


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
        },
            shipping_options: [
            {
                shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 0,
                    currency: 'usd',
                },
                display_name: 'Free shipping',
                delivery_estimate: {
                    minimum: {
                    unit: 'business_day',
                    value: 5,
                    },
                    maximum: {
                    unit: 'business_day',
                    value: 7,
                    },
                }
                }
            },
            {
                shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 1500,
                    currency: 'usd',
                },
                display_name: 'Next day air',
                delivery_estimate: {
                    minimum: {
                    unit: 'business_day',
                    value: 1,
                    },
                    maximum: {
                    unit: 'business_day',
                    value: 1,
                    },
                }
                }
            },
            ],
           line_items:  req.body.items.map((item) => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [item.product]
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          })),
           mode: "payment",
           success_url: "http://localhost:4200/success.html",
           cancel_url: "http://localhost:4200/cart",
        });

        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
});

router.post('/add-payment-method', async (req, res , next)  => {
    try { 
        const { userEmail, paymentMethodId } = req.body;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: user.stripeCustomerId,
        });

        user.paymentMethods = user.paymentMethods || [];
        user.paymentMethods.push({
            id: paymentMethodId,
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
        });

        await user.save();

        res.status(200).json({message: 'Payment method added successfully', paymentMethod });
    } catch (error) {
        console.error('Error adding payment methohd:', error);
        next(error);
    }
});

router.get('/payment-methods/:email', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ paymentMethods: user.paymentMethods || [] });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        next(error);
    }
});

router.delete('/remove-payment-method', async (req, res, next) => {
    try {
        const { userEmail, paymentMethodId } = req.body;
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await stripe.paymentMethods.detach(paymentMethodId);
        user.paymentMethods = user.paymentMethods.filter((pm) => pm.id !== paymentMethodId);
        await user.save();
        res.status(200).json({ message: 'Payment method removed successfully' });
    } catch (error) {
        console.error('Error removing payment method:', error);
        next(error);
    }
});

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            const userEmail = session.metadata.email; 
            const user = await User.findOne({ email: userEmail });
            if (user) {
                const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
                const paymentMethod = paymentIntent.payment_method;
                const paymentDetails = await stripe.paymentMethods.retrieve(paymentMethod);

                user.paymentMethods = user.paymentMethods || [];
                user.paymentMethods.push({
                    id: paymentDetails.id,
                    brand: paymentDetails.card.brand,
                    last4: paymentDetails.card.last4,
                    exp_month: paymentDetails.card.exp_month,
                    exp_year: paymentDetails.card.exp_year,
                });
                await user.save();
            }
        } catch (error) {
            console.error('Error saving payment info:', error);
        }
    }
    res.status(200).json({ received: true });
});

module.exports = router;
