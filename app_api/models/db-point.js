const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id : Number,            // unique id
  
  name: { type: String, default: "point_name"},
  short_name: { type: String, default: "point_short_name"},
  full_name: { type: String, default: "point_full_name"},

  type: { type: String, default: "text"}, //HTML5 any input type

  eu: { type: String, default: "kgs"},   //eng units
  min: { type: String, default: "0"},
  max: { type: String, default: "100"},
  step: { type: String, default: "0.1"},
  deadband: { type: Number, default: 0.1},
  min_rate: { type: Number, default: 1},  //new values min creation rate in sec
  readonly: { type: Boolean, default: false},

  options: { type: Number, ref: "digital_states" },  //ref
  
  params: [ { type: Number, ref: "db_points" } ], 

  func: String,   //function name

  createRole:{ type: Number, ref: "roles" },  //ref to roles collection
  readRole:  { type: Number, ref: "roles" },  //ref to roles collection
  updateRole:{ type: Number, ref: "roles" },  //ref to roles collection
  deleteRole:{ type: Number, ref: "roles" },  //ref to roles collection

  deleted: { type: Boolean, default: false},  
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('db_points', model); 





