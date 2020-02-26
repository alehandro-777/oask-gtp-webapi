let grepository = require('../repo/generic.repo');

exports.create = (mod) => {
    let result = {};
    let model = mod;
    let repository = grepository.create(model);
    
// POST
result.create = (req, res) => {

    repository.createMany(req.body).then(
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

// GET
result.findOne = (req, res) => {
    let id = req.params.id;

    repository.findOne({"_id": id}).then(
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

result.select = (req, res) => {
    
    //(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });    
    let query = req.query;
    let params = req.params;

    repository.find(params, {}, query).then(
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


// PUT
result.update = (req, res) => {
    repository.updateMany(req.body).then(
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


// DELETE
result.delete = (req, res) => {
    repository.deleteMany(req.body).then(
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
    return result;
}