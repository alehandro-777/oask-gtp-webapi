var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});


var instdataSchema = new mongoose.Schema({
    p : Number,
    t : Number,
    dp : Number,
    q : Number,
    currday : Number,
    lastupdate : { type: Date, default: Date.now },
    quality : Number,
    flid : Number,  //id изм линии 
    chid : Number,  //id канала корректора
});

  var InstdataModel = mongoose.model('InstHlData', instdataSchema);

exports.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {
            return new InstdataModel(value);
        });
        InstdataModel.insertMany(newarray, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.find = (query) => {
    return new Promise((resolve, reject) => {
        InstdataModel.find(query, function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};