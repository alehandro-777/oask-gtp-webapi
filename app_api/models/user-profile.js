const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id: Number,
  name: String,   //friendly name 
  profile: {}     //XML 
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('user_profiles', model);  