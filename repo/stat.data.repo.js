var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});


let statdataSchema = new mongoose.Schema({
    CO2 : Number,
    N2 : Number,
    Ro : Number,
    lastupdate : { type: Date, default: Date.now },
    quality : Number,
    flid : Number,  //id изм линии 
    chid : Number,  //id канала корректора
});

let StatdataModel = mongoose.model('StatHlData', statdataSchema);

  exports.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {
            return new StatdataModel(value);
        });
        StatdataModel.insertMany(newarray, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.find = (query) => {
    return new Promise((resolve, reject) => {
        InstdataModel.find(query, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};