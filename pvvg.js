const express = require('./index');
/*
setInterval(() => buildPvvgHoursAggregate(111, [1, 2, 3, 4], new Date("2018-02-19T00:00:00Z")).then(res=>{
  //console.log(res);
}), 5000);

setInterval(() => buildRegimAggregate([1, 2, 3, 4,5,6,7,8, 9, 10, 11, 12, 13], new Date("2018-02-19T00:00:00Z")).then(res=>{
    //console.log(res);
}), 5000);

setInterval(() => buildPvvgDaysAggregate([111], new Date("2018-02-19T00:00:00Z")).then(res=>{
    //console.log(res);
}), 5000);
//buildObjEventsAggregate
setInterval(() => runningTotalAggregate([1, 2, 3, 4], new Date("2020-02-20")).then(res=>{
  console.log(res);
}), 5000);
*/

setInterval(() => buildObjEventsAggregate([8], new Date("2018-02-20")).then(res=>{
  console.log(res);
  test();
}), 5000);


setInterval(() => test(), 5000);



//формирование почасовой группировки по ПВВГ
function buildPvvgHoursAggregate(object_id, channels, from) {
    return new Promise((resolve, reject) => {
      let Model = express.mongoose.model('HourValue');       
      let params = channels.map( e => {return {["ch_id"]: e}});  //channel Ids      
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
          //{ $addFields: { "object_id": object_id} },    //set object_id  - composite key !
          { $addFields: { "_id": { "time": "$_id", "object_id" : object_id} }  },    //set object_id  - composite key !
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
//формирование суточной группировки по ПВВГ
function buildPvvgDaysAggregate(objects, from) {
    return new Promise((resolve, reject) => {
      let Model = express.mongoose.model('PvvgHourValue');         

      let params = objects.map( e => {return {["object_id"]: e}});  //channel Ids   

      Model.aggregate([ 
          {$match:{ "_id.time" : {$gte:from}} },
          {$group: { _id: { time : {$dateToString: { format: "%Y-%m-%d", date: "$_id.time" }}, object_id : "$_id.object_id" }, 
            q: {$sum: "$q"}, 
            p: {$max: "$p"}, 
            dp: {$max: "$dp"}, 
            t: {$max: "$t"},
            lastupdate: {$last: "$lastupdate"},
            childs:  {$push: { "_id": "$_id", "q": "$q", lastupdate :  "$lastupdate"}}
        }},
          {$sort:{_id:1}},
          { $addFields: { "_id.time": {$toDate: "$_id.time"} } },                            // _id is start of contract day  !!! + id PVVG 
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

//формирование разреза данных ручного ввода по часам
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

//группировка событий по объектам 
function buildObjEventsAggregate(objects, from) {
  return new Promise((resolve, reject) => {
    let Model = express.mongoose.model('FormDataValue');       

    let params = objects.map( e => {return {["object_id"]: e}});  //channel Ids

    Model.aggregate([ 
      {$match:{ $or:params, "created_at" : {$gte:from}} },          
      {$project: {
          object_id: 1,
          data: { $arrayToObject: "$data" },
      }},
      {$group: { _id: "$object_id", 
          history: {$push: { value: "$data.state", date : "$data.date", hour : "$data.hour", 
            lastupdate: { $concat: [ "$data.date", "T", "$data.hour" ] } }}, 
      }},     
      {$merge: { into: "ObjectEvents", whenMatched: "replace" } }
      ], function(err, values) {
          if (err) {
              reject(err);
              return;
          }
          resolve(values);
    });    
  });
}

//группировка по часам результирующий объект режим ПСГ с учетом отбор/закачка и количества скважин 
function buildPsgHoursAggregate(pvvg_hour_objects, stan_events, lines_events) {
  return new Promise((resolve, reject) => {
    let Model = express.mongoose.model('PvvgHourValue');

      stan_events.sort((a, b) => a.lastupdate - b.lastupdate);  //asc sorting

      //lines_events.sort((a, b) => a.lastupdate - b.lastupdate);  //asc sorting

      let boundaries = stan_events.map(e=> {
        e.lastupdate.value = e.value;
        return e.lastupdate;
      });

      //console.log(boundaries);

      Model.aggregate([ 
        //{$match:{ "lastupdate" : {$gte:from}} },                    
        {
        $bucket: {
          groupBy: "$lastupdate",                        // Field to group by
          boundaries: boundaries,                       // Boundaries for the buckets
          default: "Other",                             // Bucket id for documents which do not fall into a bucket
          output: {                                     // Output for each bucket
            "childs" :
              { $push: { "q": "$q", "lastupdate" : "$lastupdate"} }
          }
        }
      },
      { $unwind : "$childs" },
      //{ $addFields: { "Qin": { $cond: { if: { $eq: [ "$_id.value", 1 ] }, then: "$childs.q", else: 0 } } } },
      //{ $addFields: { "Qout": { $cond: { if: { $eq: [ "$_id.value", 2 ] }, then: "$childs.q", else: 0 } } } },

      //{$merge: { into: "TestOut", whenMatched: "replace" } }

      ], function(err, values) {
          if (err) {
              reject(err);
              return;
          }
          resolve(values);
    });
  })
}





//TEMPLATE !!!
function buildAggregate(objects, from) {
  return new Promise((resolve, reject) => {})
}

function test() {
  let Model = express.mongoose.model('ObjectEvent'); 
  Model.find({}, function (err, docs) {    
    buildPsgHoursAggregate([], docs[0].history, null).then(res=>{
      
      console.log(res); 
      
    });
  });
}


//сумма по суткам с начала месяца на определенную дату
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