const ObjectId = require('mongodb').ObjectID;

exports.create = ( mod ) => {

let result = {};
let model = mod;

result.createMany = (objarray) => {
    return new Promise((resolve, reject) => {

        let newarray = objarray.map( value=> {
            return new model(value);
        });
        model.insertMany(newarray, function(err, docs) {
            if(err){  reject(err); return;  }
            resolve(docs);
        });
    });
};

//(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });

result.count = (query) => {
    return new Promise((resolve, reject) => {
        model.countDocuments(query).exec((err, count) => {
        if (err) { reject(err); return;}
        resolve(count);
    });
    });
};

result.find = (query, fields, options) => {
    return new Promise((resolve, reject) => {
        model.find(query, fields, options, function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};

result.findOne = (query) => {
    return new Promise((resolve, reject) => {
        model.findOne(query , function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};

result.updateMany = (query) => {
    return new Promise((resolve, reject) => {
        let commands = [];
        query.forEach( function(item, i, arr) {
            let id = new ObjectId(item["_id"]);
            let cmd =    { replaceOne :
                {
                   filter : {"_id" : id },
                   replacement : item,
                   upsert : false   // =true update or the replacement operation performs an insert
                }
             }
             delete item['_id'];            //immutable field _id !!!!!!!!!!!
             commands.push(cmd);
        });//foreach
        model.bulkWrite(commands).then(res => {
            resolve(res);
        });        
    });

};

result.deleteMany = (query) => {
    return new Promise((resolve, reject) => {
        let commands = [];
        query.forEach( function(item, i, arr) {
            let id = new ObjectId(item["_id"]);
            let cmd =    { deleteOne :
                {
                   filter : {"_id" : id }
                }
             }
             commands.push(cmd);
        });//foreach      
        model.bulkWrite(commands).then(res => {
            resolve(res);
        });
    });
};
result.updateOne = (query) => {

};
result.deleteOne = (query) => {};

    return result;
};

exports.findLastUpdated = (query) => {
    return new Promise((resolve, reject) => {
        HourdataModel.findOne(query, {}, { sort: { 'lastupdate' : -1 } } , function(err, docs) {
            if(err) {  reject(err); return;  }
            resolve(docs);
        });
    });
};