const express = require('./index');
const mong_model = require('./mongoose.model');
const mong_aggr_model = require('./aggregate.mongoose.model');

exports.findOne = (query) => {
  let Model = express.mongoose.model('RegimMrinPSGDay');
  return Model.findOne( {  });

  //return updateRegimDksForms([1, 2, 3, 4, 5 ,6, 7], "2018-02-19T00:00:00Z");
};

setInterval(() => updateRegimDksForms([1, 2, 3, 4, 5 ,6, 7], "2018-02-19T00:00:00Z"), 10000);

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

function createStepedReport(repo, params, begin, end, st) {
    let result = [];
    let start = new Date(begin);
    let stop = new Date(end);
    let step = parseInt(st);

  return new Promise((resolve, reject) => { 
    
    repo.find(
        { $or:params, "lastupdate" : {$gte:begin, $lt:end}  }).then(values=>{

        while (start < stop) {          

            let row = buildRow(params, values, start, step);
            result.push(row);
            start.setHours(start.getHours() + step);   
        }
        resolve(result);
    });
  });
}

//input array of object
//[{"object_id":1},{"object_id":2},{"object_id":3},{"object_id":4}] - row_template
//[{"object_id":1, ..."lastupdate" : "2020-02-19T00:00:00Z"},...] - data_array
//start, stop - Date() object
function buildRow(row_template, data_array, start, step){
    let row = {};
    var end = new Date();
    end.setTime(start.getTime());
    end.setHours(end.getHours() + step);
       
    row.time = `${addZero(start.getHours())}-${addZero(end.getHours())}`;
    //row.time = start;
    row_template.forEach(column => {

        let values = data_array.filter(dbo=> 
            (dbo.object_id == column.object_id) && 
            (dbo.lastupdate.getTime() >= start.getTime()) &&
            (dbo.lastupdate.getTime() < end.getTime())
            );

        //console.log(values);
        let value = column.ProcessArray(values, "value");
        row["param" + column.object_id] = value;   
    });
    return row;
}

function kvpToObjact(kvp_array) {
  return kvp_array.reduce((res, current) => { 
    res[current.key] = current.value;
    return res;
  }, {});
}

function updateRegimDksForms(objects, from) {
return new Promise((resolve, reject) => {
  let Model = express.mongoose.model('FormDataValue');


  let params = objects.map( e => {return {["object_id"]: e}});

  Model.find( { $or:params, "created_at" : {$gte:from}  }).then(values=>{
    let cmds = [];
    values.forEach(form_value => {
        let value_object = kvpToObjact(form_value.data);
        let Value_Model = express.mongoose.model(value_object.model);
        let mongoose_value_object = new Value_Model(value_object);
        let prms = updateRegimDksAggregate(mongoose_value_object);
        cmds.push(prms);
    });

    let all = cmds.reduce((promiseChain, currentTask) => {
      return promiseChain.then(currentTask);
  }, cmds[0]);

  all.then(res=>{
    console.log("OK");
    resolve("OK");
  });

  });

});
}

function updateRegimDksAggregate(mongoose_value_object) {
  return new Promise((resolve, reject) => {
    let Model = express.mongoose.model('RegimMrinPSGDay'); 
    let Model_row = express.mongoose.model('DksRegimRow');
    
    //console.log(mongoose_value_object);
    Model.findOneAndUpdate({ "lastupdate" :  mongoose_value_object.date }, {"lastupdate" :  mongoose_value_object.date}, {
      new: true,
      upsert: true // Make this update into an upsert
    }).then(regim_aggregate =>{
  
      regim_aggregate.set_regim_cell(mongoose_value_object);
      regim_aggregate.calc_total_row();

      regim_aggregate.save(function (err, aggr) {
        if (err) return reject(err); 
        resolve(regim_aggregate);
      });
    });
  });
}