const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: String,
  username: { type: String, index: true, unique: true },
  email: { type: String, unique: true },
  address: {
    city: String,
    state: String,
    country: String,
    pin: Number,
  },
});

userSchema.index(
  { 'address.state': 1, 'address.country': 1 },
  { unique: true }
);

module.exports = mongoose.model('User', userSchema);
