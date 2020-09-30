const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { 
    type: String, 
    require: true,
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    unique: true
  },
  password: { 
    type: String, 
    require: true,
  },
  stripe_id: {
    type: String,
    require: false,
    default: null
  },
  passwordReset: {
    type: String,
    require: false,
    select: false
  },
  isAdmin: {
    type: Boolean,
    require: true,
    default: false
  },
  address: {
    name: { type: String, require: false },
    street1: { type: String, require: false },
    street2: { type: String, require: false },
    city: { type: String, require: false },
    state: { type: String, require: false },
    zip: { type: String, require: false },
    country: { type: String, require: false }
  }
});

// Method to check if unhashed password entered by the user can be compared
// to the hashed password stored in the database.
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
