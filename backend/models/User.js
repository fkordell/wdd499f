const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /.+\@.+\..+/,
      trim: true,
    },
    password: { type: String }, 
    name: { type: String, default: '' },
    authProvider: { 
      type: String, 
      enum: ['local', 'google', 'facebook', 'auth0'], 
      default: 'local' 
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (this.authProvider !== 'local') {
        return next(); 
    }

    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);
