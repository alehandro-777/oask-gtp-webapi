var database = [];
const databasename = "test1oaskgtp";
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb://localhost:27017/mydb";



exports.create = (collection, obj) => {

    return new Promise((resolve, reject) => {

        const mongoClient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        mongoClient.connect( (err, client) => {

            if(err){  
                reject(err);
                return;  
            }
          
            let db = client.db(databasename);
            let coll = db.collection(collection);
          
            coll.insertOne(obj, function(err, result){ 
                client.close();
                if(err) {  
                    reject(err);
                    return;  
                }                
                //All OK                
                resolve(result);
            });        
          });    
    });
};

//immutable fields:  _id, created_at, ... !!!!!!!!!!! 
exports.createMany = (collection, obj) => {
    return new Promise((resolve, reject) => {

        let commands = [];

        obj.forEach( function(item, i, arr) {
            let cmd =    { insertOne :
                {
                   document : item
                }
             }
             commands.push(cmd);
        });//foreach
        
        const dbclient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        dbclient.connect( (err, client) => {
            if(err){  reject(err); return;  }
            let db = client.db(databasename);
            let coll = db.collection(collection);                      
            coll.bulkWrite(commands).then(function(r){
                client.close();
                resolve(r);
            });
        });    
    });
};


//immutable fields:  _id, created_at, ... !!!!!!!!!!! 

exports.updateMany = (collection, obj) => {          
    return new Promise((resolve, reject) => {

        let commands = [];

        obj.forEach( function(item, i, arr) {
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
        
        const dbclient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        dbclient.connect( (err, client) => {
            if(err){  reject(err); return;  }
            let db = client.db(databasename);
            let coll = db.collection(collection);                      
            coll.bulkWrite(commands).then(function(r){
                client.close();
                resolve(r);
            });
        });    
    });
};

exports.deleteMany = (collection, obj) => {
    return new Promise((resolve, reject) => {

        let commands = [];

        obj.forEach( function(item, i, arr) {
            let id = new ObjectId(item["_id"]);
            let cmd =    { deleteOne :
                {
                   filter : {"_id" : id }
                }
             }

             commands.push(cmd);
        });//foreach
        
        const dbclient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        dbclient.connect( (err, client) => {
            if(err){  reject(err); return;  }
            let db = client.db(databasename);
            let coll = db.collection(collection);                      
            coll.bulkWrite(commands).then(function(r){
                client.close();
                resolve(r);
            });
        });    
    });
};

exports.findOne = (collection, query) => {

    return new Promise((resolve, reject) => {

        const mongoClient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        mongoClient.connect( (err, client) => {
            if(err) {  
                reject(err);  
                return;
            }              
      
            let db = client.db(databasename);
            let coll = db.collection(collection);

            coll.find(query).toArray( function(err, result){
                client.close();
                    
                if(err) {  reject(err); return; } 

                let last = result[result.length-1];    
                resolve(last);

            });        
        });   
          
      });

};

exports.find = (collection, query) => {

    return new Promise((resolve, reject) => {

        const mongoClient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        mongoClient.connect( (err, client) => {
            if(err) {  
                reject(err);  
                return;
            }              
      
            let db = client.db(databasename);
            let coll = db.collection(collection);

            coll.find(query).toArray( function(err, result){
                client.close();
                    
                if(err) {  reject(err); return; } 

                resolve(result);

            });        
        });   
          
      });

};