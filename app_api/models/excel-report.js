const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
    _id: Number,
    fixed_rowset : { type: Boolean, required: true },
    short_name: { type: String, required: true }, //for title
    name: String,                                 //for ???
    template: String,                             //for template excel file 
    full_name: String,                            //descriptor
    dataset: [],
    rows: [],
    columns: [],
    sheet: Number,            //excel workbook 
    step: Number,             //time step in minutes
    length: Number,           //number of steps
    headSize: Number          //size of report header in excel rows
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
  });

module.exports = mongoose.model('excel-reports', model); 