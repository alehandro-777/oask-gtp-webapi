var database = [];
const databasename = "test1oaskgtp";
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://localhost:27017/mydb";


exports.create = (collection, obj) => {

    if( !database[collection] ) database[collection] =[];

    database[collection].push(obj);

    const mongoClient = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

    mongoClient.connect( (err, client) => {
        if(err){  console.log(err); }
      
        let db = client.db(databasename);
        let coll = db.collection(collection);
      
        coll.insertOne(obj, function(err, result){ 
            if(err) {  console.log(err);  }
            
            //All OK
            client.close();
        });
        
      });
};

exports.findOne = (collection, predicat) => {
    //collection.find().toArray(function(err, results){
    //    if(err){ 
    //      return console.log(err);
    //  }  

    return database[collection].find(predicat);
};