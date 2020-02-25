var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});


var entitySchema = new mongoose.Schema({
    paramid : Number,    //unique parameter id
    sensorid : Number,    //number - sersorId or null - manual parameter
    name : String,       //text
});

var EntityModel = mongoose.model('RegimParameter', entitySchema);

exports.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {
            return new EntityModel(value);
        });
        EntityModel.insertMany(newarray, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.find = (query) => {
    return new Promise((resolve, reject) => {
        EntityModel.find(query, function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.findOne = (query) => {
    return new Promise((resolve, reject) => {
        EntityModel.findOne(query , function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};

