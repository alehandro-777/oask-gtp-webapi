const repo = require('./repo/hour.data.repo');
const proc = require('./hcalc.processor');

exports.findOne = (query) => {
    return createView1(query);
};

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
function buildRow(columns){
    
    if (columns.length===0) return null;    
    //console.log(result);
    let newRow = {};
    let hasKeys = false;
    columns.forEach(column => {
        if (column.length > 0) {
            hasKeys = true;
            //console.log(column);
            //console.log(value);
            let start = new Date(column[0].start);
            let stop = new Date(column[0].lastupdate);            
            newRow['time'] = `${start.getHours()}-${stop.getHours()}`;        
            newRow[column.cfg.col] = column[0][column.cfg.attr];
            column.shift();            
        }
    });
    if (!hasKeys) return null;
    return newRow;   
}

createView1(repo, 
    [
        {flid:1, attr:"q", col:"col1"},
        {flid:2, attr:"q", col:"col2"},
        {flid:3, attr:"q", col:"col3"},
        {flid:4, attr:"q", col:"col4"},
        {flid:8, attr:"q", col:"col5"}
], 
    
    "2020-02-19T12:00", "2020-02-20T00:00");