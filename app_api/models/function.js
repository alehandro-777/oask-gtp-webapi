const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id: Number,
  short_name: { type: String, required: true }, //for execution
  full_name: String,                            //descriptor
  name: String,
  params: [], 
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('functions', model); 