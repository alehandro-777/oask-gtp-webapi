const repository = require('../repository');
const xml2js = require('xml2js');
const tmpprocessor = require('../template.processor');

// POST
exports.create = (req, res) => {
    try{
        var templateObj = {};
        templateObj.strBody = JSON.stringify(req.body); //string JSON body
        templateObj.created = Date();
        templateObj.doc = req.body.request.doc[0];  //параметр фильтрации

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
        ).catch(
            error=>{
                return res.status(500).send(error);
            });       
    }
    catch(err){
        return res.status(500).send(err);
    }
};

//поведение зависит от параметра(-ов) query.date может возвращать исх шаблон либо пытается транслировать

exports.findOne = (req, res) => {
    let collection = req.params.id;

        repository.findOne("templates", {doc : collection}).then(
            searchRes=>{
                let templateObj = JSON.parse(searchRes.strBody);

                tmpprocessor.translate(templateObj.request, req.query);

                var builder = new xml2js.Builder();
                var xml = builder.buildObject(templateObj);
                res.set('Content-Type', 'text/xml');
                return res.send(xml);    
                    },
            error=>{
                return res.status(500).send(error);
            }
        ).catch(
            error=>{
                return res.status(500).send(error);
            }
        );

};