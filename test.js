const proc = require('./calc.processor.js');


const mgsmodel = require('./mongoose.model');
const grepository = require('./repo/generic.repo');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});

let dbodata_model = mgsmodel.createDBObjectValueModel(mongoose);
let dbodata_repository = grepository.create(dbodata_model);   

let dbo_model = mgsmodel.createDBObjectModel(mongoose);
let dbo_repository = grepository.create(dbo_model);   

let h_model = mgsmodel.createHourHlibModel(mongoose);



function Sum(values, parname){
  return values.reduce(function(sum, current) { return sum + current; }, 0);
}

function SumAttr(values, parname){
  return values.reduce(function(sum, current) { return sum + current[parname]; }, 0);
}

function Avg(values, parname){
  return values.reduce(function(sum, current) { return sum + current; }, 0) / values.length;
}

function AvgAttr(values, parname){
  return values.reduce(function(sum, current) { return sum + current[parname]; }, 0) / values.length;
}


function calcDBO(id, begin, end) {

  return new Promise((resolve, reject) => {

    let result = [];
    let start = new Date(begin);
    let stop = new Date(end);
    let cmd = [];
    let model = mongoose.model('DBObject');
  
    model.findOne({"object_id" : id}).then(dbo=>{
      if (!dbo) {
        reject(null);
        return;
      }
      dbo.params.forEach(element => {
        let model = mongoose.model(element.model);
        let prms = getOneParamValue(model, element, begin, end);
        cmd.push(prms);
      });
  
      Promise.all(cmd).then(values=>{ 
        let res = eval(dbo.func+"(values)"); 
        resolve(res);

      }).catch(err => 
        reject(err));
    });
  
  });

  
}

function getOneParamValue(model, element, begin, end) {
  return model.find({ $or:[element.query], "lastupdate" : {$gte:begin, $lt:end}  }).then(values=>{
    return eval(element.func+"(values,'"+element.attr+"');");  
});

}


calcDBO(7, "2020-02-19T14:00:00Z", "2020-02-19T15:00:00Z").then(res => {
  console.log(res);
}).catch(err => 
  console.log(err));
