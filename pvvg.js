const express = require('./index');


setInterval(() => inputFormsData( new Date("2017-02-20")).then(res=>{
  //console.log(res);
  test();
  CalcSummators();
  CalcPvvgHourData();
  CalcPvvgDayData(new Date("2017-02-20"));
  runningTotalMonthStart(new Date("2020-02-20"));
  runningTotalDayStart(new Date("2020-02-19T16:00:00"));
}), 5000);


//setInterval(() => test(), 5000);


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

      let boundaries = stan_events.map(e => e.lastupdate );

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

      ], function(err, values) {
          if (err) {
              reject(err);
              return;
          }
            values.forEach(element => {

              let match = stan_events.find( e=>e.lastupdate.getTime() == element._id.getTime() );
              if (match !== undefined)
              {
                
                if (match.value===1) {
                  element.q_in = element.childs.q;
                  element.q_out = 0;

                }
                if (match.value===2) {
                  element.q_in = 0;
                  element.q_out = element.childs.q;

                }
                if (match.value===0) {
                  element.q_in = 0;
                  element.q_out = 0;

                }
              }
            });

          resolve(values);
    });
  })
}





//TEMPLATE !!!
function buildAggregate(objects, from) {
  return new Promise((resolve, reject) => {})
}

function test() {
  let Model = express.mongoose.model('DBObjectValue'); 
  Model.find({}, function (err, docs) {    
     //console.log(docs);      
    });
}


//сумма по суткам с начала месяца на определенную дату
function runningTotalMonthStart(on_date) {
  return new Promise((resolve, reject) => {

    let Model = express.mongoose.model('PvvgDayValue');
         
    let start_month = new Date();
    start_month.setTime(on_date.getTime());
    start_month.setDate(1);

    Model.aggregate([ 
      {$match:{ "_id.time" : {$gte:start_month, $lte:on_date }} },          
      {$out: "PvvgDayRunValue1" }

    ], function(err, values) {
        if (err) {
            reject(err);
            return;
        }

        express.mongoose.connection.db.collection("PvvgDayRunValue1", function (err, collection) {
          if (err) {
            reject(err);
            return;
        }
          collection.aggregate([ 
            {$group: { _id: "$_id.pvvg_id", 
              q: {$sum: "$q"}, 
              p: {$max: "$p"}, 
              dp: {$max: "$dp"}, 
              t: {$max: "$t"},
              start: {$max: "$start"},
              lastupdate: {$last: "$lastupdate"}  
          }},
            { $set: { "_id.pvvg_id": "$_id" }},      
            { $set: { "_id.time": on_date }},
            {$merge: { into: "PvvgDayRunValue", whenMatched: "replace" } }
          ], function(err, values) {            
              if (err) {
                  reject(err);
                  return;
              }
              values.toArray((err, data)=> console.log(data));              
              
              resolve(values);
        }); 

      }); //find collection       

  });    //});//aggregation

   
  });//promise


}

//сумма по часам с начала суток на определенный час
function runningTotalDayStart(on_hour) {
  return new Promise((resolve, reject) => {

    let Model = express.mongoose.model('PvvgHourValue');
         
    let start_hour = new Date();
    start_hour.setTime(on_hour.getTime());
    start_hour.setHours(0);

    Model.aggregate([ 
      {$match:{ "_id.time" : {$gte:start_hour, $lte:on_hour }} },          
      {$out: "PvvgHourRunValue1" }

    ], function(err, values) {
        if (err) {
            reject(err);
            return;
        }

        express.mongoose.connection.db.collection("PvvgHourRunValue1", function (err, collection) {
          if (err) {
            reject(err);
            return;
        }
          collection.aggregate([ 
            {$group: { _id: "$_id.pvvg_id", 
              q: {$sum: "$q"}, 
              p: {$max: "$p"}, 
              dp: {$max: "$dp"}, 
              t: {$max: "$t"},
              start: {$max: "$start"},
              lastupdate: {$last: "$lastupdate"}  
          }},
            { $set: { "_id.pvvg_id": "$_id" }},      
            { $set: { "_id.time": on_hour }},
            {$merge: { into: "PvvgHourRunValue", whenMatched: "replace" } }
          ], function(err, values) {            
              if (err) {
                  reject(err);
                  return;
              }
              values.toArray((err, data)=> console.log(data));              
              
              resolve(values);
        }); 

      }); //find collection       

  });    //});//aggregation

   
  });//promise


}

//формирование  ручного ввода
function inputFormsData(from) {
  return new Promise((resolve, reject) => {

    let Model = express.mongoose.model('FormDataValue');       

    Model.aggregate([ 
      {$match:{ "created_at" : {$gte:from}} },          
      {$project: {
          object_id: 1,
          data: { $arrayToObject: "$data" }
      }},
      { $addFields: { "_id.time": {$toDate: { $concat: [ "$data.date", "T", "$data.hour" ] }}, "_id.object_id": "$object_id" } },
      { $addFields: { "value": "$data.value" }},
      { $addFields: { "state": "Ok" }},
      { $addFields: { "source": "manual" }},
      { $unset: "data" },
      { $unset: "object_id" },
      {$merge: { into: "DBObjectValues", whenMatched: "replace" } }
      ], function(err, values) {
          if (err) {
              reject(err);
              return;
          }
          resolve(values);
    });    
  });
}

//расчет сумматоров (TODO фильтрацию с чего начинать !!!)
function CalcSummators() {
  return new Promise((resolve, reject) => {

    let Model = express.mongoose.model('Summator'); 

    Model.aggregate([ 
      
      { $unwind: "$operands" },

      {
        $lookup:
           {
              from: "DBObjectValues",
              localField: "operands._id",
              foreignField: "_id.object_id",
              as: "values"
          }
     },
     { $unwind: "$values" },

      { $addFields: { "value" : { $multiply: [ { $toDecimal: "$values.value" }, "$operands.k" ] }}},
      { $addFields: { "_id" : { f_id:"$_id", p_id:"$values._id" } } },

      {$group: { _id: { f_id:"$_id.f_id", time:"$_id.p_id.time" },  
        object_id: {$last: "$object_id"}, 
        value : {$sum: "$value"}
      }},
      { $addFields: { "_id": {object_id:"$object_id", time:"$_id.time"} }},
      { $addFields: { "state": "Ok" }},
      { $addFields: { "source": "summator" }},
      { $unset: "_id.f_id" },
      {$merge: { into: "DBObjectValues1", whenMatched: "replace" } }
      ], function(err, values) {
          if (err) {
              reject(err);
              return;
          }
          resolve(values);
    });    
  });
}

//расчет часовых сумм PVVG (TODO фильтрацию с чего начинать !!!)
function CalcPvvgHourData() {
  return new Promise((resolve, reject) => {

    let Model = express.mongoose.model('PvvgCfg'); 

    Model.aggregate([      
      {
        $lookup:
           {
              from: "hourvalues",
              localField: "channels",
              foreignField: "ch_id",
              as: "values"
          }
     },
     { $unwind: "$values" },

      { $addFields: { "q" : "$values.q" }},
      { $addFields: { "p" : "$values.p" }},
      { $addFields: { "t" : "$values.t" }},
      { $addFields: { "dp" : "$values.dp" }},
      { $addFields: { "start" : "$values.start" }},
      { $addFields: { "lastupdate" : "$values.lastupdate" }},

      { $addFields: { "_id" : { pvvg_id:"$_id", p_id:"$values._id" } } },

      {$group: { _id: { pvvg_id:"$_id.pvvg_id", time:"$values.start" },  
        q : {$sum: "$q"},
        p : {$max: "$p"},
        t : {$max: "$t"},
        dp : {$max: "$dp"},
        start :{$max: "$start"},
        lastupdate : {$max: "$lastupdate"},
      }},    

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
function CalcPvvgDayData(from) {
  return new Promise((resolve, reject) => {
    let Model = express.mongoose.model('PvvgHourValue');         

    Model.aggregate([ 
        {$match:{ "_id.time" : {$gte:from}} },
        {$group: { _id: { time : {$dateToString: { format: "%Y-%m-%d", date: "$_id.time" }}, pvvg_id : "$_id.pvvg_id" }, 
          q: {$sum: "$q"}, 
          p: {$max: "$p"}, 
          dp: {$max: "$dp"}, 
          t: {$max: "$t"},
          start : {$max: "$start"},
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