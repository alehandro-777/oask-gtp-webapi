exports.createDayHlibModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        p : Number,
        t : Number,
        dp : Number,
        q : Number,
        start : { type: Date , default: Date.now},          // !!! lastupdate - 7 start of contract day
        lastupdate : { type: Date , default: Date.now},
        quality : Number,
        ch_id : Number,  //id канала корректора
        rec_offset : Number,  //rec offset in h lib file
    });
    
    schema.index({ "ch_id": 1, "rec_offset": 1, "start": 1}, { unique: true });

    let model = mongoose.model('DayValue', schema);
    return model;
}

exports.createHourHlibModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        p : Number,
        t : Number,
        dp : Number,
        q : Number,
        start : { type: Date , default: Date.now},           // !!! lastupdate - 7 start of contract day
        lastupdate : { type: Date, default: Date.now },
        quality : Number,
        ch_id : Number,  //id канала корректора
        rec_offset : Number,  //rec offset in h lib file
    });
    
    schema.index({ "ch_id": 1, "rec_offset": 1, "start": 1}, { unique: true });    

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
        _id : Number,           //key
        addr : Number,
        name : String,
        ip : String,            //for ftp or ASK-2
        ftpDir : String,
        channels : [{           //CorrectorChannelCfg
            _id : Number,      //unique id - для привязки к линии как к источнику данных 
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

exports.createPVVGModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id : Number,                                       // unique DBObject ид 
        name : { type: String, default: 'Name' },           //key object name
        form_id : Number,                                   //create / edit form  gui model
        channels : { type: String, default: '[]' }          //JSON array
    });

    let model = mongoose.model('PVVGObject', schema);
    return model;
}


exports.createDBObjectModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id : Number,                                       // unique DBObject ид 
        name : { type: String, default: 'Name' },           //key object name
        key : { type: String, default: 'short_name' },      //key object short name for aggregation
        fullname : { type: String, default: 'Full name' },  //object full name
        form_id : Number,                                   //create / edit form  gui model
        model : String,                                     //mongoose model name for values object
    });

    let model = mongoose.model('DBObject', schema);
    return model;
}

//example model for values object
exports.createDBObjectValueModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        object_id : Number,     // unique line ид 
        name : String,          //key name - for debug
        value : Number,         //value as num
        state : String,         //value as string
        source : String,        //value source
        lastupdate : { type: Date , default: Date.now} 
    });

    let model = mongoose.model('DBObjectValue', schema);
    return model;
}

exports.createGuiTableModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id : Number,      // unique ид 
        name : String,         //friendly  name 
        columns : [{           //Cfg array
          key : String,       //column name
          label : String     //header name
        }] 
    });

    let model = mongoose.model('GuiTable', schema);
    return model;
}

exports.createFormModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id : Number,              // unique ид
        name : String,                // friendly  name
        controls : [
            {
                key: String,          // field- param id 
                label: String,        // friendly field name
                value: String,        // field value
                controlType: String,  // 'dropdown', or textbox
                order: Number,        //rendering order
                type:{ type: String,  default: "text" },    // <input type="..."
                options: [
                  { key: String,  value: String }     //options for select element
                ]        
            }
        ]
    });

    let model = mongoose.model('Form', schema);
    return model;
}

exports.createFormDataModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        form_id : Number,                        // unique ид
        object_id : Number,                        // unique object ид
        data : [{}],                                //   key:data array 
        created_at : { type: Date , default: Date.now} 
    });

    let model = mongoose.model('FormDataValue', schema);
    return model;
}


exports.createUserMenu = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id : Number,              // unique ид
        name : String,             // login  name
        buttons: [
            { label: String,  link: String }     //menu buttons
          ]  
    });

    let model = mongoose.model('Menu', schema);
    return model;
}


exports.createVtvModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        date : { type: Date },
        dks: Number,
        fuel: Number,
        psg: Number,
        object_id: Number,
        created_at : { type: Date , default: Date.now}
    });  
    let model = mongoose.model('VtvDay', schema);
    return model;
}

exports.createRegimDksModel = (mongoose) =>{       
    let schema = new mongoose.Schema({
        date : { type: Date },
        key : String,
        model : String,
        hour : Number,
        p_in: Number,
        p_out: Number,
        e: { type: Number , default: 1.0},
        num_gpa: Number,
        object_id: Number,
        created_at : { type: Date , default: Date.now}
    });  

    let model = mongoose.model('RegimDksHourValue', schema);  

    return model;
}

exports.createRegimPSGModel = (mongoose) =>{    
    let schema = new mongoose.Schema({
        date : { type: Date },
        key : String,
        model : String,
        hour : Number,
        q_in: Number,
        q_out: Number,
        num_lines: Number,
        object_id: Number,
        created_at : { type: Date , default: Date.now}
    });
    let model = mongoose.model('RegimPSGHourValue', schema);  
    return model;
}

exports.createEventHistoryModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id: Number,        //valve object id
        history :[{
            state: String,
            value: Number,   
            lastupdate : { type: Date , default: Date.now}, 
        }],
    });
    
    let model = mongoose.model('ObjectEvent', schema);
    return model;
}

exports.createPvvgDValueModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id : { type: Date },
        p: Number,
        t: Number,
        dp: Number,
        q: Number,
        object_id: Number,
        lastupdate : { type: Date , default: Date.now},
        childs:[{}]
    }, {collection:'PvvgDayValues'});
    let model = mongoose.model('PvvgDayValue', schema);
    return model;
}

exports.createPvvgHValueModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id : { type: Date },
        p: Number,
        t: Number,
        dp: Number,
        q: Number,
        object_id: Number,
        lastupdate : { type: Date , default: Date.now} 
    }, {collection:'PvvgHourValues'});
    let model = mongoose.model('PvvgHourValue', schema);
    return model;
}