exports.createTestModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        param1 : Number,
        param2 : Number,
        param3 : Number,
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