const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
    active: { type: Boolean, default: true }, 
    granularity: {
        type: String,
        default: "days",
        enum: ["secs", "mins", "hours", "days", "months", "years"],
    },
    role:{ type: Number, ref: "roles" },  //block this role
    time_stamp: { type: Date, required: true, default: Date.now  },   
    user: { type: Number, ref: 'users' },  
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false}
  });

module.exports = mongoose.model('input_blocks', model); 