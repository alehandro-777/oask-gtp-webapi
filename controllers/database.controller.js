const processreq = require('../request.processor');
const repository = require('../repository');
const xml2js = require('xml2js');

// POST
exports.create = (req, res) => {
    //return res.status(400).send({ message: "Entity name can not be empty" });

    let doc = req.body.request.doc[0];
    let date = new Date(req.body.request.date);

    try{
        var result = processreq(req.body.request);
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(req.body);
        result.xml = xml;

        repository.create(doc, result);
        res.set('Content-Type', 'text/xml');
        return res.send(xml);  
    }
    catch(err){
        return res.status(500).send(err);
    }

};

// GET
exports.select = (req, res) => {

    var result = processreq(req.body.request);

    console.log(result);

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(req.body);

    res.set('Content-Type', 'text/xml');       
    return res.send(xml);             
};


// GET with a Id
exports.findOne = (req, res) => {

    let collection = req.params.id;
    let date = new Date(req.query.date);

    try{
        var result = repository.findOne(collection, { "date": { $gte: date } });
        console.log(result);  
        res.set('Content-Type', 'text/xml');
        return res.send(result.xml);    
    }
    catch(err){
        return res.status(500).send(err);
    }
};

// PUT
exports.update = (req, res) => {

    let collection = req.params.id;

    try{
        var result = processreq(req.body.request);
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(req.body);
        result.xml = xml;
        result.created = new Date();

        repository.create(collection, result);

        var xmlOk = builder.buildObject({message: collection + " updated Ok"});
        res.set('Content-Type', 'text/xml');
        return res.send(xmlOk);  
    }
    catch(err){
        return res.status(500).send(err);
    }
};


// DELETE
exports.delete = (req, res) => {
    res.send();
};

