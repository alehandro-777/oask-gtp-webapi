const processreq = require('../template.processor');
const repository = require('../repository');
const xml2js = require('xml2js');
const parseString = require('xml2js').parseString;
const builder = new xml2js.Builder();


// POST
exports.create = (req, res) => {

    let collection = req.params.id;

    //console.log(req.body);

    let arr = processreq.estractMany(req.body.root)  //[{ col1: '12.23', col2: '6.3' }, ...]
 
    processreq.add_created_version(arr);
    processreq.remove_id(arr);

    repository.createMany(collection, arr).then(
        result=>{
            let xml = builder.buildObject({insertedCount : result.insertedCount});
            res.set('Content-Type', 'text/xml');
            return res.send(xml);          
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

    repository.find(collection, {}).then(
        result=>{

            let xmlRead = processreq.formatToXmlFriendly(result);
            let xml = builder.buildObject({root:xmlRead});
            res.set('Content-Type', 'text/xml');
            return res.send(xml);          
        },
        error=>{
            return res.status(500).send(error);        
        }
    ).catch(
        error=>{
            return res.status(500).send(error);
        });            
};


// PUT
exports.update = (req, res) => {
    let collection = req.params.id;

    let arr = processreq.estractMany(req.body.root)  //[{ col1: '12.23', col2: '6.3' }, ...]
    processreq.add_uppdated_incversion(arr);

    repository.updateMany(collection, arr).then(
        result=>{
            let xml = builder.buildObject(result);
            res.set('Content-Type', 'text/xml');
            return res.send(xml);          
        },
        error=>{
            return res.status(500).send(error);        
        }
    ).catch(
        error=>{
            return res.status(500).send(error);
        });
};


// DELETE
exports.delete = (req, res) => {
    let collection = req.params.id;

    let arr = processreq.estractMany(req.body.root)  //[{ col1: '12.23', col2: '6.3' }, ...]

    repository.deleteMany(collection, arr).then(
        result=>{
            let xml = builder.buildObject(result);
            res.set('Content-Type', 'text/xml');
            return res.send(xml);          
        },
        error=>{
            return res.status(500).send(error);        
        }
    ).catch(
        error=>{
            return res.status(500).send(error);
        });
};

