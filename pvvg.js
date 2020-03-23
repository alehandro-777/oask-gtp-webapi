const express = require('./index');
const mong_model = require('./mongoose.model');
const mong_aggr_model = require('./aggregate.mongoose.model');

setInterval(() => buildPvvgDayReport([1, 2, 3, 4], new Date("2018-02-19T00:00:00Z")), 10000);

//buildPvvgDayReport([1, 2, 3, 4], new Date("2018-02-19T00:00:00Z"));

function buildPvvgDayReport(objects, from) {
    return new Promise((resolve, reject) => {
      let Model = express.mongoose.model('HourValue');       
      let params = objects.map( e => {return {["ch_id"]: e}});  //channel Ids
      let cmds = [];
      Model.aggregate([ 
          {$match:{ $or:params, "lastupdate" : {$gte:from}} }, 
          {$group: { _id: '$lastupdate', q: {$sum: "$q"}, p: {$max: "$p"}, dp: {$max: "$dp"}, t: {$max: "$t"}  }},
          {$sort:{_id:1}}
        ], function(err, values) {
        //{ _id: 2020-02-19T11:00:00.000Z, q: 400, p: 50, dp: 1000, t: 30 },
        //console.log(values);
        values.forEach(pvvg_hour => {
            let prms = updatePvvgDayAggregate(pvvg_hour);
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

function updatePvvgDayAggregate(pvvg_hour){
    return new Promise((resolve, reject) => {
        const k_hour = 7;
        let Model = express.mongoose.model('PvvgDayReport'); 
        let Model_row = express.mongoose.model('FloTecHourRec');       

        let req_date = new Date(pvvg_hour["_id"]);
        req_date.setHours(req_date.getHours() - k_hour);
        req_date.setMilliseconds(0);
        req_date.setMinutes(0);
        req_date.setHours(0);
        req_date.setSeconds(0);
        
        //console.log(req_date);

        //console.log(mongoose_value_object);
        Model.findOneAndUpdate({ "lastupdate" :  req_date.toISOString() }, 
            {"lastupdate" :  req_date.toISOString()}, 
            {
        new: true,
        upsert: true // Make this update into an upsert
        }).then(aggregate =>{        
            pvvg_hour.lastupdate = pvvg_hour["_id"];
            delete pvvg_hour["_id"];
            let val = new Model_row(pvvg_hour);
            console.log(pvvg_hour);
            console.log(val);
            aggregate.hours[0] = val;

        aggregate.save(function (err, aggr) {
            if (err) return reject(err); 
            resolve(aggregate);
        });

        });
    });        
}