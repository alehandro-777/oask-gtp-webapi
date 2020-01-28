const tmpprocessor = require('../template.processor');
const repository = require('../repository');
const xml2js = require('xml2js');
const builder = new xml2js.Builder();


// GET
exports.select = (req, res) => {
    return res.send("Not implemented");           
};

// GET
exports.findOne = (req, res) => {
    let collection = req.params.id;

    repository.find(collection, {}).then(//repository.findOne(collection, { "date": { $gte: date } }).then(
        result=>{          
            let out =[];
            result.forEach(element => {
                element["id"] = JSON.stringify(element._id);
                element["created"] = JSON.stringify(element.created);
                delete element._id;
                delete element.bodyStr;
                let node = {row:element};                
                out.push(node);
            });

            var xml = builder.buildObject(out);

            res.set('Content-Type', 'text/xml');
            return res.send(xml);    
        }
    ).catch(
        error=>{
            return res.status(500).send(error);
        }
    );           
};