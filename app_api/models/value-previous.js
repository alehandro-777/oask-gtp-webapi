const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id: { time_stamp:{type: Date}, point:{type: Number}},
  value: { type: Number, default: 0 }, 
  state: { type: String, default: "Normal" }, 
  deleted: { type: Boolean, default: false },
  user: { type: Number, ref: 'users' },
  point: { type: Number, ref: 'db_points' },  
  time_stamp: { type: Date, required: true, default: Date.now},    
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
});

model.index({ "point": 1, "time_stamp": 1});    

module.exports = mongoose.model('db_point_previous_values', model); 