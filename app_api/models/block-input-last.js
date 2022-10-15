const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
    _id: { time_stamp:{type: Date}, role:{type: Number}},
    active: { type: Boolean, default: true }, 
    granularity: String,
    role:{ type: Number, ref: "roles" },  //block this role
    time_stamp: { type: Date, required: true, default: Date.now  },   
    user: { type: Number, ref: 'users' },  
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
  });

  model.index({ "role": 1, "time_stamp": 1});   

module.exports = mongoose.model('input_blocks_lasts', model); 