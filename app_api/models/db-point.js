const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
  _id : Number,            // unique id
  
  name: { type: String, default: "point_name"},
  short_name: { type: String, default: "point_short_name"},
  full_name: { type: String, default: "point_full_name"},

  type: { type: String, default: "text"}, //HTML5 any input type

  eu: { type: String, default: "kgs"},
  min: { type: String, default: "0"},
  max: { type: String, default: "100"},
  step: { type: String, default: "0.1"},
  deadband: { type: Number, default: 0.1},
  readonly: { type: Boolean, default: false},

  options: { type: Number, ref: "select_options" },  //ref
  // add only !!! f = point1_value*k + point2_value*k ...
  formula: [ {
      point: { type: Number, ref: "db_points" }, 
      k: { type: Number, default: 1}, // 
      interval: { type: Number, default: 0} //confidence interval in sec
    } ], 

  createRole:{ type: String, ref: "roles" },  //ref to roles collection
  readRole:  { type: String, ref: "roles" },  //ref to roles collection
  updateRole:{ type: String, ref: "roles" },  //ref to roles collection
  deleteRole:{ type: String, ref: "roles" },  //ref to roles collection

  deleted: { type: Boolean, default: false},  
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('db_points', model); 





