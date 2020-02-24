var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});


var systemSchema = new mongoose.Schema({

    systemid: Number, //RealTimeSensor id
    name: String,
    path: String,        //SCADA path
    ip: String,          //SCADA path
    period: Number,      //RealTimeData   update period
    sensors: [
        {
            sensorid: Number,    //RealTimeSensor id
            name: String,
            path: String,        //SCADA path
            lowlimit: Number,    //validation 
            highlimit: Number   //validation
        }
    ]      
});

  var SystemModel = mongoose.model('RtSystem', systemSchema);

exports.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {
            return new SystemModel(value);
        });
        SystemModel.insertMany(newarray, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.find = (query) => {
    return new Promise((resolve, reject) => {
        SystemModel.find(query, function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.findOne = (query) => {
    return new Promise((resolve, reject) => {
        SystemModel.findOne(query , function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};

