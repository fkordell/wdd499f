const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const User = require('../models/User');
const axios = require('axios');

require('dotenv').config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router.post('/create-checkout-session', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: req.body.userEmail,
            });
            user.stripeCustomerId = customer.id;
            await user.save();
            console.log('Stripe customer created:', customer.id);
        } else {
            console.log('Existing Stripe customer ID:', user.stripeCustomerId);
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: user.stripeCustomerId,
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'],
            },
            phone_number_collection: {
                enabled: true,
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
                            minimum: { unit: 'business_day', value: 5 },
                            maximum: { unit: 'business_day', value: 7 },
                        },
                    },
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
                            minimum: { unit: 'business_day', value: 1 },
                            maximum: { unit: 'business_day', value: 1 },
                        },
                    },
                },
            ],
            line_items: req.body.items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: [item.product],
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            payment_intent_data: {
                setup_future_usage: 'off_session',
            },
            metadata: {
                email: req.body.userEmail,
            },
            success_url: 'http://localhost:4200/cart',
            cancel_url: 'http://localhost:4200/cart',
        });
        res.status(200).json(session);
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        next(error);
    }
});

// Add Payment Method
router.post('/add-payment-method', async (req, res, next) => {
    try {
        const { userEmail, paymentMethodId } = req.body;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        if (paymentMethod.customer && paymentMethod.customer !== user.stripeCustomerId) {
            console.log('Payment method is already attached to a different customer. Skipping attach.');
        } else if (!paymentMethod.customer) {
            console.log('Attaching payment method to customer:', user.stripeCustomerId);
            await stripe.paymentMethods.attach(paymentMethodId, { customer: user.stripeCustomerId });
        }

        user.paymentMethods = user.paymentMethods || [];
        user.paymentMethods.push({
            id: paymentMethodId,
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
        });

        await user.save();
        res.status(200).json({ message: 'Payment method added successfully', paymentMethod });
    } catch (error) {
        console.error('Error adding payment method:', error);
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

// Webhook for Payment Events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log('Webhook verified successfully! Event type:', event.type);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            const userEmail = session.metadata?.email;
            if (!userEmail) {
                console.error('User email not found in metadata.');
                return res.status(400).json({ message: 'User email not found in session metadata.' });
            }

            const user = await User.findOne({ email: userEmail });
            if (!user) {
                console.error('User not found:', userEmail);
                return res.status(404).json({ message: 'User not found.' });
            }

            user.name = session.customer_details?.name || user.name;
            user.address = session.customer_details?.address || user.address;
            user.phone = session.customer_details?.phone || user.phone;
            user.country = session.customer_details?.address?.country || user.country;

            const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id);
            const stripeItems = lineItemsResponse.data;

            const items = stripeItems.map((lineItem) => ({
                id: lineItem.id,
                name: lineItem.description,
                product: lineItem.price.product,
                price: lineItem.amount_total / 100,
                quantity: lineItem.quantity,
            }));

            const total = session.amount_total / 100;
            const date = new Date();

            user.purchaseHistory = user.purchaseHistory || [];
            user.purchaseHistory.push({ items, total, date });

            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
            const paymentMethodId = paymentIntent.payment_method;
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

            if (paymentMethod && paymentMethod.card) {
                user.paymentMethods = user.paymentMethods || [];
                user.paymentMethods.push({
                    id: paymentMethod.id,
                    brand: paymentMethod.card.brand,
                    last4: paymentMethod.card.last4,
                    exp_month: paymentMethod.card.exp_month,
                    exp_year: paymentMethod.card.exp_year,
                });
                console.log('Payment method added to user:', paymentMethod.id);
            }

            // Clear the cart
            user.cart = [];
            await user.save();
            console.log('Purchase history updated and cart cleared successfully.');
        } catch (error) {
            console.error('Error processing checkout.session.completed:', error.message);
        }
    }

    res.status(200).json({ received: true });
});

module.exports = router;
