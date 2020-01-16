const processreq = require('../request.processor');
const repository = require('../repository');
const xml2js = require('xml2js');

// POST
exports.create = (req, res) => {
    //return res.status(400).send({ message: "Entity name can not be empty" });

    let doc = req.body.request.doc;
    let date = new Date(req.body.request.date);

    try{
        repository.create(doc, req.body);
        return res.send({ message: doc + "  Created Ok" });  
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

    var result = repository.findOne(collection, (d)=> d);
    
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(result);

    res.set('Content-Type', 'text/xml');
    res.send(xml);
};

// PUT
exports.update = (req, res) => {


    res.send();
};


// DELETE
exports.delete = (req, res) => {
    res.send();
};

// PATCH
exports.partialupdate = (req, res) => {
    
    if(!req.body) {
        return res.status(400).send({
            message: "Object body can not be empty"
        });
    }
    res.send();
};
