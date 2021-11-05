const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  user: { type: Number, ref: 'users' },
  data: {},             //raw posted data
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('transactions', model);
































