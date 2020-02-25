exports.createTestModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        a : Number,
        b : Number,
        c : Number,
        d : Number,
        e : Number,
    });    
    let model = mongoose.model('Test', schema);
    return model;
}

exports.createCorrectorModel = (mongoose) =>{
    let schema = new mongoose.Schema({
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
    let model = mongoose.model('Corrector', schema);
    return model;
}

exports.createFlowLineModel = (mongoose) =>{
    let schema = new mongoose.Schema({
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

    let model = mongoose.model('FlowLine', schema);
    return model;
}