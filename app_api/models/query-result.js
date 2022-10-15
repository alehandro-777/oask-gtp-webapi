const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
    params: [],  
    result: [],
    time_stamp: { type: Date, required: true, default: Date.now  },   
    query: { type: Number, ref: 'queries' },  
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false}
  });

module.exports = mongoose.model('query-results', model); 