var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});


var hourdataSchema = new mongoose.Schema({
    p : Number,
    t : Number,
    dp : Number,
    q : Number,
    start : { type: Date },
    end : { type: Date },
    quality : Number,
    flid : Number,  //id изм линии 
    chid : Number,  //id канала корректора
});

  var HourdataModel = mongoose.model('HourHlData', hourdataSchema);

  exports.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {
            return new HourdataModel(value);
        });
        HourdataModel.insertMany(newarray, function(err, docs) {
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