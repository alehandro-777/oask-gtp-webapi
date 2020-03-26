const express = require('./index');

setInterval(() => buildPvvgHoursAggregate([1, 2, 3, 4], new Date("2018-02-19T00:00:00Z")).then(res=>{
  //console.log(res);
}), 5000);

setInterval(() => buildRegimAggregate([1, 2, 3, 4], new Date("2018-02-19T00:00:00Z")).then(res=>{
    //console.log(res);
}), 5000);

setInterval(() => buildPvvgDaysAggregate([111], new Date("2018-02-19T00:00:00Z")).then(res=>{
    //console.log(res);
}), 5000);

setInterval(() => runningTotalAggregate([1, 2, 3, 4], new Date("2020-02-20")).then(res=>{
  console.log(res);
}), 5000);


function buildPvvgHoursAggregate(objects, from) {
    return new Promise((resolve, reject) => {
      let Model = express.mongoose.model('HourValue');       
      let params = objects.map( e => {return {["ch_id"]: e}});  //channel Ids      
      Model.aggregate([ 
          {$match:{ $or:params, "lastupdate" : {$gte:from}} },                    
          {$group: { _id: '$start', // group by start of contract day 
            q: {$sum: "$q"}, 
            p: {$max: "$p"}, 
            dp: {$max: "$dp"}, 
            t: {$max: "$t"},
            lastupdate: {$last: "$lastupdate"}  
        }},
          {$sort:{_id:1}},
          { $addFields: { "object_id": 111} },    //set object_id  - composite key !
          {$merge: { into: "PvvgHourValues", whenMatched: "replace" } }
        ], function(err, values) {
            if (err) {
                reject(err);
                return;
            }
            resolve(values);
      });    
    });
}

function buildPvvgDaysAggregate(objects, from) {
    return new Promise((resolve, reject) => {
      let Model = express.mongoose.model('PvvgHourValue');         

      let params = objects.map( e => {return {["object_id"]: e}});  //channel Ids   

      Model.aggregate([ 
          {$match:{ $or:params, "_id" : {$gte:from}} },
          {$group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$_id" } }, 
            q: {$sum: "$q"}, 
            p: {$max: "$p"}, 
            dp: {$max: "$dp"}, 
            t: {$max: "$t"},
            lastupdate: {$last: "$lastupdate"},
            childs:  {$push: { "_id": "$_id", "q": "$q", lastupdate :  "$lastupdate"}}
        }},
          {$sort:{_id:1}},
          { $addFields: { "object_id": 111} },
          { $addFields: { "_id": {$toDate: "$_id"}} },  // _id is start of contract day  !!! + id PVVG 
          {$merge: { into: "PvvgDayValues", whenMatched: "replace" } }
        ], function(err, values) {
            if (err) {
                reject(err);
                return;
            }
            resolve(values);
      });    
    });
}

function buildRegimAggregate(objects, from) {
    return new Promise((resolve, reject) => {
      let Model = express.mongoose.model('FormDataValue');       
      let params = objects.map( e => {return {["object_id"]: e}});  //channel Ids      
      Model.aggregate([ 
        {$match:{ $or:params, "created_at" : {$gte:from}} },          
        {$project: {
            form_id: 1,
            object_id: 1,
            created_at: 1,
            data: { $arrayToObject: "$data" }
        }},
        {$group: { _id: { date:"$data.date", hour:"$data.hour" }, 
        data: {$push: { data: "$data"}}, 
        }},
        {$merge: { into: "formConvValues", whenMatched: "replace" } }
        ], function(err, values) {
            if (err) {
                reject(err);
                return;
            }
            resolve(values);
      });    
    });
}


function runningTotalAggregate(objects, on_date) {
  return new Promise((resolve, reject) => {

    let Model = express.mongoose.model('PvvgDayValue');
      
    let params = objects.map( e => {return {["ch_id"]: e}});  //channel Ids
    
    let start_month = new Date();
    start_month.setTime(on_date.getTime());
    start_month.setDate(1);
    
    Model.aggregate([ 
        {$match:{ "_id" : {$gte:start_month, $lte:on_date }} },          
        {$group: { _id: null, 
          q: {$sum: "$q"}, 
          p: {$max: "$p"}, 
          dp: {$max: "$dp"}, 
          t: {$max: "$t"},
          lastupdate: {$last: "$lastupdate"}  
      }},        
        { $addFields: { "object_id": 111} },
        //{ $addFields: { "_id": { $dateToString: { format: "%Y-%m-%d", date: to } }} },
        { $addFields: { "_id": on_date }},
        {$merge: { into: "PvvgDayRunValue", whenMatched: "replace" } }
      ], function(err, values) {
          if (err) {
              reject(err);
              return;
          }
          resolve(values);
    });    
  });
}