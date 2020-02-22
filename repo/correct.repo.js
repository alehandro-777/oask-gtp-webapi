var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});


var corrSchema = new mongoose.Schema({
    corrid : Number,
    addr : Number,
    name : String,
    ip : String,            //for ftp or ASK-2
    ftpDir : String,
    channels : [{           //CorrectorChannelCfg
        chid : Number,      //unique id - для привязки к линии как к источнику данных 
        chno : Number,      //1 2 3 internal corrector channel number
        name : String,      //friendly line name  
        template : String,  //шаблон имени файла хослиб
        isAbsP : Boolean,   //P sersor type
        chour : Number,     //contract hour
        hasR : Boolean,     //has hour file
        hasH : Boolean     //has periodic file    }]           
    }]
});

  var CorrectorsModel = mongoose.model('Correctors', corrSchema);

  exports.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {                        
            return  new CorrectorsModel(value);
        });

        CorrectorsModel.insertMany(newarray, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.find = (query) => {
    return new Promise((resolve, reject) => {
        CorrectorsModel.find(query, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.findOne = (query) => {
    return new Promise((resolve, reject) => {
        CorrectorsModel.findOne(query , function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};