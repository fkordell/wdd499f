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

const CartItemSchema = new mongoose.Schema(
  {
    product: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    id: { type:  Number,  required: true },
  },
  { _id: false }
);

const PurchaseItemSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  name: { type: String, required: true },
  product: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const PurchaseHistorySchema = new mongoose.Schema({
  items: [PurchaseItemSchema],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

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
    address: { type: Object },
    country: {type: String },
    phone: { type: String },
    authProvider: { 
      type: String, 
      enum: ['local', 'google-oauth2', 'facebook', 'auth0'], 
      default: 'local' 
    },
    stripeCustomerId: { type: String, default: null},
    paymentMethods: { type: [PaymentMethodSchema], default: [] },
    cart : {type: [CartItemSchema], default: [] },
    purchaseHistory: { type: [PurchaseHistorySchema], default: []  },
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
