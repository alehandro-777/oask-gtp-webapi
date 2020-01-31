const processreq = require('../template.processor');
const repository = require('../repository');
const xml2js = require('xml2js');
const parseString = require('xml2js').parseString;
const builder = new xml2js.Builder();


// POST
exports.create = (req, res) => {

    let collection = req.params.id;

    let arr = processreq.estractMany(req.body.root)  

    console.log(arr.row);

    repository.createMany(collection, arr.row).then(
        result=>{
            return res.send(xmlOk);          
        },
        error=>{
            return res.status(500).send(error);        
        }
    ).catch(
        error=>{
            return res.status(500).send(error);
        });
};

// GET
exports.select = (req, res) => {
    let collection = req.params.id;

    res.set('Content-Type', 'text/xml');       
    return res.send(xml);             
};


// PUT
exports.update = (req, res) => {
    let collection = req.params.id;

    console.log(req.body)
    return res.send(req.body);
};


// DELETE
exports.delete = (req, res) => {
    let collection = req.params.id;

    console.log(req.body)
    return res.send(req.body);
};

