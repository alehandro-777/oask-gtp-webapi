const proc = require('./calc.processor.js');


const mgsmodel = require('./mongoose.model');
const grepository = require('./repo/generic.repo');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1oaskgtp', {useNewUrlParser: true, useUnifiedTopology : true});
let dbodata_model = mgsmodel.createDBObjectValueModel(mongoose);
let dbodata_repository = grepository.create(dbodata_model);   

//REPORT MODEL
/* 
{rows:[{row}]}

//header row {cells:[]}
//simple row {cells:[]}
//total  row {cells:[]} sum, avg

//array cell
//one cell
//avg cell
//sum cell

*/

class RepCell {
    constructor() {
      this.repo;
      this.query;
      this.attr;
      this.colname;
    }
}




exports.findOne = (query) => {
    return createView1(query);
};


function createView2(repo, params, begin, end) {
    let result = [];

    let start = new Date(begin);
    let stop = new Date(end);
    let cmd = [];
/*
    params.forEach((element) => {
        //create hour snapshot
        let p1 = repo.find({"object_id": element, "lastupdate" : {$gte:begin, $lt:end}  });
        cmd.push(p1);
    });

    Promise.all(cmd).then(values=>{
        result = buildRows(values);
    });
    */

repo.find({ $or:[{"object_id":1},{"object_id":2},{"object_id":3},{"object_id":4}], "lastupdate" : {$gte:begin, $lt:end}  }).then(values=>{
    console.log(values);
});

}


function createView1(repo, params, begin, end) {
    let result = [];

    let start = new Date(begin);
    let stop = new Date(end);
    let request = start;

    let count =1;
    var cmd = [];

    while (request < stop) {
        var columns = [];
        //loop for row
        params.forEach((element) => {
            //create hour snapshot
            //let p1 = proc.gethistHour(element.flid, request.toISOString()).then(res=>{
            let p1 = repo.find({"flid": element.flid, "lastupdate" : request.toISOString()}).then(res=>{
                res.cfg = element;
                return res;
            });
            columns.push(p1);
        });
        let a1 = Promise.all(columns).then(values=>{
            //console.log(count," : ",values);            
            let row = buildRow(values);
            while (row) {
                result.push(row);
                row = buildRow(values); //if more then 1 records
            }
            count++;    //for test only
        });
        cmd.push(a1);        
        request.setHours(request.getHours()+1);
    }
    Promise.all(cmd).then(values=>{
        console.log(result);
    });
};

//input array of arraies - hour snapshot
function buildRows(columns){
    let result = [];

    if (columns.length===0) return null;    
    //console.log(result);
    let newRow = {};
    columns.forEach(column => {
        column.forEach(value => {
            console.log(value);
        });
    });

    return result;   
}

/*
createView1(repo, 
    [
        {flid:1, attr:"q", col:"col1"},
        {flid:2, attr:"q", col:"col2"},
        {flid:3, attr:"q", col:"col3"},
        {flid:4, attr:"q", col:"col4"},
        {flid:8, attr:"q", col:"col5"}
], 
    
    "2020-02-19T12:00", "2020-02-20T00:00");
*/    

function test(){
    dbodata_repository.find({"object_id": 1}).then(res=>{
        res.forEach(value=>{
            console.log(value.lastupdate.getHours());
        })
        
    });
}

//test();
createView2(dbodata_repository,  [1,2,3,4], "2020-02-19T00:00:00Z", "2020-02-20T00:00:00Z");