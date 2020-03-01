const repo = require('./repo/hour.data.repo');


exports.findOne = (query) => {
    return createView1(query);
};

function createView1(repo, params, begin, end) {
    let result = [];


    let start = new Date(begin);
    let stop = new Date(end);
    let request = start;
    let mcmd  = [];
    let count =0;
    while (request < stop) {
        let cmd = [];
        params.forEach(element => {
            let p1 = repo.find({"flid": element.flid, "lastupdate" : request});
            cmd.push(p1);      
        });
        let m1 = Promise.all(cmd);
        mcmd.push(m1);
        request.setHours(request.getHours()+1);
    }
    Promise.all(mcmd).then(values=>{
        processRow(result, values);
    });
};

//input array of arraies
function processRow(result, columns){

//console.log(columns);
    let newRow = {};
    let i = 1;
    columns.forEach(column => {
        console.log(column);
        //newRow.timestamp = value.lastupdate;
        column.forEach(value => {
            newRow['col'+i] = value.q;
        });      
    });
    result.push(newRow);
}

createView1(repo, 
    [{flid:3, attr:"q", col:"col1"},
    {flid:4, attr:"q", col:"col2"}], 
    "2020-02-19T00:00", "2020-02-19T23:00");