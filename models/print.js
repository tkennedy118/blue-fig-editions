const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrintSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: false, default: 'No description provided.' },
  series: { type: String, require: false, default: 'Original Print' },
  price: { type: Number, require: true, default: 10 },
  count: { type: Number, require: false, default: 1 },
  image: { type: String, require: true }
});

const Print = mongoose.model('Print', PrintSchema);
module.exports = Print;
