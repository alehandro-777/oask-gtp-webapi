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

exports.createMany = (collection, obj) => {

    return new Promise((resolve, reject) => {

        const mongoClient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        mongoClient.connect( (err, client) => {

            if(err){  
                reject(err);
                return;  
            }
          
            let db = client.db(databasename);
            let coll = db.collection(collection);
          
            coll.insertMany(obj, function(err, result){ 
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

exports.updateMany = (collection, obj) => {

    return new Promise((resolve, reject) => {

        let retResult = [];        

        obj.forEach( function(item, i, arr) {

            let id = new ObjectId(item["_id"]);

            updateOne(collection, {"_id" : id },  item).then(
                result=>{
                    retResult.push(result.ops);
                },
                err=>{
                    console.log(err);
                }
            );
        });
        resolve(retResult);   
    });
};

function updateOne(collection, query,  newValues) {
    return new Promise((resolve, reject) => { 
        const dbclient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        dbclient.connect( (err, client) => {

            if(err){  
                reject(err);
                return;  
            }          
            let db = client.db(databasename);
            let coll = db.collection(collection);            
            
            delete newValues['_id'];    //immutable field _id !!!!!!!!!!!
            
            coll.updateOne( query, {$set: newValues}, function(err, result){

                client.close();

                if(err) {  
                    console.log(err);
                    reject(err);
                    return;  
                }
                //All OK
                console.log(result.result.nModified + " document(s) updated");                
                
                //console.log(result);
                resolve(result);
            });    
          });    
    });
};


exports.deleteMany = (collection, obj) => {

    return new Promise((resolve, reject) => {

        let retResult = [];        

        obj.forEach( function(item, i, arr) {

            let id = new ObjectId(item["_id"]);

            deleteOne(collection, {"_id" : id }).then(
                result=>{
                    retResult.push(result.result);
                },
                err=>{
                    console.log(err);
                }
            );
        });
        resolve(retResult);   
    });
};

function deleteOne(collection, query) {
    return new Promise((resolve, reject) => { 
        const dbclient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
        dbclient.connect( (err, client) => {

            if(err){  
                reject(err);
                return;  
            }          
            let db = client.db(databasename);
            let coll = db.collection(collection);            
            
           
            coll.deleteOne( query, function(err, result){

                client.close();

                if(err) {  
                    console.log(err);
                    reject(err);
                    return;  
                }
                //All OK
                console.log(result.result);                
                
                //console.log(result);
                resolve(result);
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