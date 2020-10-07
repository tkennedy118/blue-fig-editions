const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  session_id: { type: String, require: true },
  purchase_id: { type: String, require: true },
  status: { type: 'String', require: true, default: 'purchased' }
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);
module.exports = Purchase;
