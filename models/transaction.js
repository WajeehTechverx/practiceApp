const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timeStamp = require('mongoose-timestamp');

const TransactionSchema = new Schema({
	sellerMail :{ type: String },
	buyerMail: { type: String },
	productID: { type: Number },
	bidHistory: []
});

TransactionSchema.plugin(timeStamp);
module.exports = mongoose.model('Transaction', TransactionSchema);