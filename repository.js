var database = [];
const databasename = "test1oaskgtp";
const MongoClient = require('mongodb').MongoClient;

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