const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});

let schema = new mongoose.Schema({
  p : { type: Number , default: 0, label:"FUCK1"},
  t : { type: Number , default: 0, label:"FUCK2"},
  dp : { type: Number , default: 0, label:"FUCK3"},
  q : { type: Number , default: 0, label:"FUCK4"},
  start : { type: Date , default: Date.now, label:"FUCK"},
  lastupdate : { type: Date , default: Date.now, },
  quality : Number,
  ch_id : Number,  //id канала корректора
  rec_offset : Number,  //rec offset in h lib file
});

let model = mongoose.model('TestValue', schema);

var SongSchema = mongoose.model('TestValue').schema

let inst = new model({"p":12});

console.log(SongSchema.tree);

mongoose.connection.once('open', function() {
  // we're connected!
  console.log("Connected");
 // console.log(schema.tree);

  inst.save(function (err, inst) {
    if (err) return console.error(err);

  });

});