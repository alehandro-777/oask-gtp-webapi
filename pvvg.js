const express = require('./index');
const mong_model = require('./mongoose.model');
const mong_aggr_model = require('./aggregate.mongoose.model');

setInterval(() => buildRegimAggregate([1, 2, 3, 4], new Date("2018-02-19T00:00:00Z")).then(res=>{
    console.log(res);
}), 5000);

setInterval(() => buildPvvgDaysAggregate([1, 2, 3, 4], new Date("2018-02-19T00:00:00Z")).then(res=>{
    console.log(res);
}), 5000);

setInterval(() => runningTotalAggregate([1, 2, 3, 4], new Date("2018-02-19T00:00:00Z")).then(res=>{
  console.log(res);
}), 5000);



function buildPvvgHoursAggregate(objects, from) {
    return new Promise((resolve, reject) => {
      let Model = express.mongoose.model('HourValue');       
      let params = objects.map( e => {return {["ch_id"]: e}});  //channel Ids      
      Model.aggregate([ 
          {$match:{ $or:params, "lastupdate" : {$gte:from}} },                    
          {$group: { _id: '$lastupdate', 
            q: {$sum: "$q"}, 
            p: {$max: "$p"}, 
            dp: {$max: "$dp"}, 
            t: {$max: "$t"},
            begin: {$first: "$lastupdate"}, 
            lastupdate: {$last: "$lastupdate"}  
        }},
          {$sort:{_id:1}},
          { $addFields: { "object_id": 111} },
          {$merge: { into: "PvvgHourValue", whenMatched: "replace" } }
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
      let Model = express.mongoose.model('HourValue');       
      let params = objects.map( e => {return {["ch_id"]: e}});  //channel Ids      
      Model.aggregate([ 
          {$match:{ $or:params, "lastupdate" : {$gte:from}} },          
          //{$group: { _id: '$lastupdate', q: {$sum: "$q"}, p: {$max: "$p"}, dp: {$max: "$dp"}, t: {$max: "$t"}  }},
          {$group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastupdate" } }, 
            q: {$sum: "$q"}, 
            p: {$max: "$p"}, 
            dp: {$max: "$dp"}, 
            t: {$max: "$t"},
            begin: {$first: "$lastupdate"}, 
            lastupdate: {$last: "$lastupdate"}  
        }},
          {$sort:{_id:1}},
          { $addFields: { "object_id": 111} },
          {$merge: { into: "PvvgDayValue", whenMatched: "replace" } }
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
        {$merge: { into: "PvvgDayValue1", whenMatched: "replace" } }
        ], function(err, values) {
            if (err) {
                reject(err);
                return;
            }
            resolve(values);
      });    
    });
}

function runningTotalAggregate(objects, from) {
  return new Promise((resolve, reject) => {
    let collection = express.mongoose.connection.db.collection('PvvgDayValue');

    let mapFunction1 = function() {
      let dt = new Date(this._id);
      emit(this._id, this.q);
    };
    var reduceFunction1 = function(keyCustId, values) {
      return Array.sum(values);
    };

    collection.mapReduce( 
      mapFunction1, 
      reduceFunction1,
      { out: "map_reduce_example" })
    .then(err, res=>{
      console.log(res);
      resolve(res);
    }); 

  });
}