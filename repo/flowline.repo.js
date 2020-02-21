var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});


var flowLineSchema = new mongoose.Schema({

    flid : Number,          // unique line ид 
    name : String,          //friendly flowline name 
    eic : String,
    chid : Number,          //CorrectorChannelCfg - привязка к физ линии
    cfgLines : [{           //FlowLineCfg array
      flid : Number,        //operand - ид физ линии линии
      koef : Number,        //коэф пропорц слагаемого +/- с которой участвует линия в расчете
      leadPt : Boolean,      //ведущая линия для результата расчета Р, иначе расчет среднего
      leadStat : Boolean    //ведущая линия для результата расчета стат параметров, иначе расчет среднего
    }] 
});

  var FlowLineModel = mongoose.model('Flowlines', flowLineSchema);

exports.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {                        
            return  new FlowLineModel(value);
        });

        FlowLineModel.insertMany(newarray, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

exports.find = (query) => {
    return new Promise((resolve, reject) => {
        FlowLineModel.find(query, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};