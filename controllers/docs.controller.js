const tmpprocessor = require('../template.processor');
const repository = require('../repository');
const xml2js = require('xml2js');
const builder = new xml2js.Builder();

// POST
exports.create = (req, res) => {
    let result;
    
    try{
        let values = tmpprocessor.estract(req.body.request);
        result = {...values};
        result.bodyStr = JSON.stringify(req.body);
        result.created = new Date();
        repository.create(result.doc, result).then(
            result=>{
                var builder = new xml2js.Builder();
                var xmlOk = builder.buildObject({message: "Document created Ok"});
                res.set('Content-Type', 'text/xml');
                return res.send(xmlOk);          
            },
            error=>{
                return res.status(500).send(error);        
            }
        ).catch(
            error=>{
                return res.status(500).send(error);
            });
     
    }
    catch(err){
        return res.status(500).send(err);
    }

};

// GET
exports.select = (req, res) => {
    return res.send("Not implemented");           
};


// GET with a Id
exports.findOne = (req, res) => {

    let collection = req.params.id;
    let date = req.query.date;

    repository.findOne(collection, { date : date  }).then(//repository.findOne(collection, { "date": { $gte: date } }).then(
        result=>{
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(JSON.parse(result.bodyStr));

            res.set('Content-Type', 'text/xml');
            return res.send(xml);    
        }
    ).catch(
        error=>{
            return res.status(500).send(error);
        }
    );
};

// PUT
exports.update = (req, res) => {
    try{
  //      var result = processreq(req.body.request);
        

        
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(req.body);
        result.xml = xml;
        result.created = new Date();

        repository.create(result.doc, result).then(
            result=>{
                var xmlOk = builder.buildObject({message: result.ops[0].doc + " updated Ok"});
                res.set('Content-Type', 'text/xml');
                return res.send(xmlOk);  
            },
            error=>{
                return res.status(500).send(error);        
            }
        );
    }
    catch(err){
        return res.status(500).send(err);
    }
};


// DELETE
exports.delete = (req, res) => {
    res.send();
};

