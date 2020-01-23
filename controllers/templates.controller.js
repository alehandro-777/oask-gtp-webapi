const repository = require('../repository');
const xml2js = require('xml2js');

// POST
exports.create = (req, res) => {
    try{
        var templateObj = {};
        templateObj.strBody = JSON.stringify(req.body);
        templateObj.created = Date();
        templateObj.doc = req.body.request.doc[0];

        repository.create("templates", templateObj).then(
            result=>{
                var builder = new xml2js.Builder();
                var xmlOk = builder.buildObject({message: "Template created Ok"});
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

exports.findOne = (req, res) => {

    let doc = req.params.id;
    let date = new Date(req.query.date);

    try{
        repository.findOne("templates", { doc : doc  }).then(
            result=>{
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(result.strBody);
                res.set('Content-Type', 'text/xml');
                return res.send(xml);    
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