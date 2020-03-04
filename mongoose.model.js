exports.createDayHlibModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        p : Number,
        t : Number,
        dp : Number,
        q : Number,
        start : { type: Date , default: Date.now},
        lastupdate : { type: Date , default: Date.now},
        quality : Number,
        ch_id : Number,  //id канала корректора
        rec_offset : Number,  //rec offset in h lib file
    });    
    let model = mongoose.model('DayValue', schema);
    return model;
}

exports.createHourHlibModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        p : Number,
        t : Number,
        dp : Number,
        q : Number,
        start : { type: Date , default: Date.now},
        lastupdate : { type: Date, default: Date.now },
        quality : Number,
        ch_id : Number,  //id канала корректора
        rec_offset : Number,  //rec offset in h lib file
    });    
    let model = mongoose.model('HourValue', schema);
    return model;
}

exports.createInstHlibModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        p : Number,
        t : Number,
        dp : Number,
        q : Number,
        currday : Number,
        lastupdate : { type: Date, default: Date.now },
        quality : Number,
        ch_id : Number,  //id канала корректора
    });    
    let model = mongoose.model('InstValue', schema);
    return model;
}

exports.createStatHlibModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        CO2 : Number,
        N2 : Number,
        Ro : Number,
        lastupdate : { type: Date, default: Date.now },
        quality : Number,
        ch_id : Number,  //id канала корректора
    });    
    let model = mongoose.model('StatValue', schema);
    return model;
}

exports.createRtSystemModel = (mongoose) =>{
    let schema = new mongoose.Schema({
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
    let model = mongoose.model('RtSystem', schema);
    return model;
}

exports.createRtValueModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        
        paramid : Number,    //unique parameter id
        sensorid : Number,    //number - sersorId or null - manual parameter
        value : Number, 
        state : String,       //text
        stateDesc : String,   //test state descriptor (auto? out of limits)
        lastupdate : { type: Date, default: Date.now },
        quality : Number,     //
        user : String,        //who input data

    });    
    let model = mongoose.model('RtValue', schema);
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

// ??? 
exports.createFlowLineModel = (mongoose) =>{

    var schema = new mongoose.Schema({

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

  var model = mongoose.model('Flowline', schema);
  return model;
}

exports.DBObject = (mongoose) =>{
    let schema = new mongoose.Schema({
        object_id : Number,    // unique DBObject ид 
        name : String,         //key object name
        fullname : String,     //object name
        type : String,         //key type name
        func : String,         //function name - get state(s) of DBObject
        params : [{}]          //function params array                    
    });

    let model = mongoose.model('DBObject', schema);
    return model;
}

//states of DBObject
exports.DBObjectValue = (mongoose) =>{
    let schema = new mongoose.Schema({
        object_id : Number,     // unique line ид 
        object_name : String,   //key name - for debug
        real : Number,          //value as num
        state : String,         //value as string
        lastupdate : { type: Date , default: Date.now} 
    });

    let model = mongoose.model('DBObjectValue', schema);
    return model;
}

exports.createGuiTableModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        tableid : Number,      // unique ид 
        name : String,         //friendly  name 
        columns : [{           //Cfg array
          name : String,       //column name
          display : String     //header name
        }] 
    });

    let model = mongoose.model('GuiTable', schema);
    return model;
}

exports.createFormModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        formid : Number,              // unique ид
        name : String,                // friendly  name
        controls : [
            {
                key: String,          // 'brave', - unique param id 
                label: String,        // friendly field name
                value: String,        // field value
                controlType: String,  // 'dropdown', or textbox
                order: Number,        //rendering order
                options: [
                  { key: String,  value: String }     //options for select element
                ]        
            }
        ]
    });

    let model = mongoose.model('Form', schema);
    return model;
}

exports.createUserMenu = (mongoose) =>{
    let schema = new mongoose.Schema({
        userid : Number,              // unique ид
        name : String,                // login  name
        buttons: [
            { label: String,  link: String }     //menu buttons
          ]  
    });

    let model = mongoose.model('UserBundle', schema);
    return model;
}