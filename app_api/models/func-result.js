const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
    params: [{ }],  
    value: { type: Number, default: 0 }, 
    state: { type: String, default: "Normal" }, 
    time_stamp: { type: Date, required: true, default: Date.now  },   
    func: { type: Number, ref: 'functions' },  
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false}
  });

module.exports = mongoose.model('func-results', model); 