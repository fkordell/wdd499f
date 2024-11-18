import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  authProvider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  firstName: { type: String },
  lastName: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
  },
  dateOfBirth: { type: Date },
  phoneNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
