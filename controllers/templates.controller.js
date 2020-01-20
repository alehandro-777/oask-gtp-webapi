const repository = require('../repository');
const xml2js = require('xml2js');

// POST
exports.create = (req, res) => {
    try{
        var result = {};
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(req.body);
        result.xml = xml;
        result.created = Date();
        result.doc = req.body.request.doc[0];

        repository.create("templates", result).then(
            result=>{
                res.set('Content-Type', 'text/xml');
                return res.send(result.ops[0].xml);          
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

exports.findOne = (req, res) => {

    let doc = req.params.id;
    let date = new Date(req.query.date);

    try{
        repository.findOne("templates", { doc : doc  }).then(//repository.findOne(collection, { "date": { $gte: date } }).then(
            result=>{
                res.set('Content-Type', 'text/xml');
                return res.send(result.xml);    
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