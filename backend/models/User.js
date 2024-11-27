const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PaymentMethodSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, 
    brand: { type: String, required: true }, 
    last4: { type: String, required: true },
    created_at: { type: Date, default: Date.now }, 
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /.+\@.+\..+/,
      trim: true,
    },
    password: { type: String, required: function () {
      return this.authProvider === 'local'; 
    } }, 
    name: { type: String, default: '' },
    authProvider: { 
      type: String, 
      enum: ['local', 'google-oauth2', 'facebook', 'auth0'], 
      default: 'local' 
    },
    stripeCustomerId: { type: String, default: null},
    paymentMethods: { type: [PaymentMethodSchema], default: [] },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
