const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
    _id: Number,
    row_num: { type: Number, default: 1 }, //header row count
    title: { type: String, required: true }, //for title
    template: String,                        //for template excel file 
    headers: [String],
    rows: [],
    columns: []
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
  });

module.exports = mongoose.model('forms', model); 