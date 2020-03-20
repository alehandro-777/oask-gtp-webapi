const express = require('./index');

const mong_model = require('./mongoose.model');
const mong_aggr_model = require('./aggregate.mongoose.model');

exports.findOne = (query) => {

    let c1 = new SumColumn(1);
    let c2 = new SumColumn(2);
    let c3 = new SumColumn(3);
    let c4 = new SumColumn(4);

    let start = new Date(query.dt);
    let stop = new Date(query.dt);

    start.setDate(start.getDate() - 1); 

return createStepedReport(
  express.app.dbodata_repo,  
    [c1,c2,c3,c4],      //[{"object_id":1},{"object_id":2},{"object_id":3},{"object_id":4}]
    start.toISOString(), 
    stop.toISOString(),
    "1"
);

};

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
  kvp_array.map((e) => {
    return {[e.key]: e.value};
 });
}

function updateRegimDksForms(objects, from) {
  let Model = express.mongoose.model('DksRegim');

  model.find( { $or:params, "created_at" : {$gte:from}  }).then(values=>{
      values.forEach(form_value => {
      let value_object = kvpToObjact(form_value.data);
      let mongoose_value_object = new Model(value_object);
      updateRegimDksAggregate(mongoose_value_object);
    });
  });
}

function updateRegimDksAggregate(mongoose_value_object) {
  let Model = express.mongoose.model('RegimMrinPSGDay');//DksRegim
  Model.find( { "lastupdate" :  mongoose_value_object.date }).then(regim_aggregates=>{
    let regim_aggregate;
    if (regim_aggregates.length === 0) {
      regim_aggregate = new Model({"lastupdate" :  mongoose_value_object.date});
    }
    else{
      regim_aggregate = regim_aggregates[0];
    }
    
  });
}