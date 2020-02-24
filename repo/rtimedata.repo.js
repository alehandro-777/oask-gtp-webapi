var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});


var rtdataSchema = new mongoose.Schema({
    paramid : Number,    //unique parameter id
    sensorid : Number,    //number - sersorId or null - manual parameter
    value : Number, 
    state : String,       //text
    stateDesc : String,   //test state descriptor (auto? out of limits)
    lastupdate : { type: Date, default: Date.now },
    quality : Number,     //
    user : String,        //who input data
});

  var RTdataModel = mongoose.model('RtData', rtdataSchema);

exports.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {
            return new RTdataModel(value);
        });
        RTdataModel.insertMany(newarray, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.find = (query) => {
    return new Promise((resolve, reject) => {
        RTdataModel.find(query, function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.findOne = (query) => {
    return new Promise((resolve, reject) => {
        RTdataModel.findOne(query , function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.findLastUpdated = (query) => {
    return new Promise((resolve, reject) => {
        RTdataModel.findOne(query, {}, { sort: { 'lastupdate' : -1 } } , function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};