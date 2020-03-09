const proc = require('./calc.processor.js');


const mgsmodel = require('./mongoose.model');
const grepository = require('./repo/generic.repo');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});
let dbodata_model = mgsmodel.createDBObjectValueModel(mongoose);
let dbodata_repository = grepository.create(dbodata_model);   



function createStepedReport(repo, params, begin, end) {
  let result = [];
  let start = new Date(begin);
  let stop = new Date(end);

return new Promise((resolve, reject) => { 
  
  repo.find(
      { $or:params, "lastupdate" : {$gte:begin, $lt:end}  }).then(values=>{
      resolve(values);
  });
});
}



class DBObject {
    constructor(id) {
      this.object_id = id;     // unique line ид 
      this.name;          //key name 
      this.params = [];        //array of parameters
      this.formula = (values) => values.reduce(function(sum, current) { return sum + current; }, 0);
    }
  }

let dbo = new DBObject(1);
dbo.params = [{"object_id":1}, {"object_id":2},{"object_id":3}];

let res;
eval("res = dbo.formula([1,2,3]);")
console.log(res);