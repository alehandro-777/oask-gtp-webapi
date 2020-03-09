const proc = require('./calc.processor.js');


const mgsmodel = require('./mongoose.model');
const grepository = require('./repo/generic.repo');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});
let dbodata_model = mgsmodel.createDBObjectValueModel(mongoose);
let dbodata_repository = grepository.create(dbodata_model);   



//сумматор
class SumColumn{
    constructor(id){
      this.object_id = id;  
    }
    ProcessArray(values, parname){
        return values.reduce(function(sum, current) { return sum + current[parname]; }, 0);
    };
}

//average
class AvgColumn{
    constructor(id){
      this.object_id = id;  
    }
    ProcessArray(values, parname){
      return values.reduce(function(sum, current) { return sum + current[parname]; }, 0) / values.length;
    };
}

//max
class MaxColumn{
    constructor(id){
      this.object_id = id;  
    }
    ProcessArray(values, parname){
        let max;
        values.forEach(element => {
          if(element[parname] > max) max = element[parname];
        });
        return max;
    };
}






exports.findOne = (query) => {

    let c1 = new SumColumn(1);
    let c2 = new SumColumn(2);
    let c3 = new SumColumn(3);
    let c4 = new SumColumn(4);

return createStepedReport(
    dbodata_repository,  
    [c1,c2,c3,c4],      //[{"object_id":1},{"object_id":2},{"object_id":3},{"object_id":4}]
    query.from, 
    query.to,
    query.step
);

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
        let value = column.ProcessArray(values, "value");
        row["param" + column.object_id] = value;   
    });
    return row;
}

let c1 = new SumColumn(1);
let c2 = new SumColumn(2);
let c3 = new SumColumn(3);
let c4 = new SumColumn(4);

createStepedReport(
    dbodata_repository,  
    [c1,c2,c3,c4],//[{"object_id":1},{"object_id":2},{"object_id":3},{"object_id":4}]
    "2020-02-18T22:00:00Z", 
    "2020-02-20T00:00:00Z",
    2
).then(res=>{
    console.log(res);
});

