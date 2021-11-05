const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  point: { type: Number, ref: 'db_points' },  
  value: { type: Number, default: 0 }, 
  state: { type: String, default: "Normal" }, 
  time_stamp: { type: Date, required: true, default: Date.now  },   
  deleted: { type: Boolean, default: false },
  transaction: { type: Number, ref: 'transactions' },  
},
{
  timestamps: { createdAt: 'created_at'}
});

model.index({ "point": 1, "time_stamp": 1});    

module.exports = mongoose.model('db_point_values', model); 
