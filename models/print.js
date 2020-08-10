const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrintSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  series: { type: String, require: false },
  price: { type: Number, require: true },
  count: { type: Number, require: true, default: 0 }
});

const Print = mongoose.model('Print', PrintSchema);
module.exports = Print;
