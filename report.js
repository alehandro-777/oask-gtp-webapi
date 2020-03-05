const proc = require('./calc.processor.js');


const mgsmodel = require('./mongoose.model');
const grepository = require('./repo/generic.repo');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});
let dbodata_model = mgsmodel.createDBObjectValueModel(mongoose);
let dbodata_repository = grepository.create(dbodata_model);   


exports.findOne = (query) => {
    return createView1(query);
};

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

function createStepedReport(repo, params, begin, end, step) {
    let result = [];
    let start = new Date(begin);
    let stop = new Date(end);

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
        let value = proc.SumChan(values, "value");
        row["col" + column.object_id] = value;   
    });
    return row;
}




createStepedReport(
    dbodata_repository,  
    [{"object_id":1},{"object_id":2},{"object_id":3},{"object_id":4}],
    "2020-02-18T22:00:00Z", 
    "2020-02-20T00:00:00Z",
    2
).then(res=>{
    console.log(res);
});

