let repository = require('../report');


// GET VIEW
exports.findOne = (req, res) => {
    Object.assign(req.query, req.params);
    repository.findOne(req.query).then(
        result=>{
            return res.send(result);          
        },
        error=>{
            return res.status(500).send(error);        
        }
    ).catch(
        error=>{
            return res.status(500).send(error);
        });            
};