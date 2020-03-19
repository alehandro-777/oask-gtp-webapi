const domain = require('../model');

exports.create = (mod, repository) => {
    let result = {};
    let model = mod;
    
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
    let id = parseInt(req.params.id);
    
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
    
    //console.log(req.query);
    //(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });    
    
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.size);
    let skip = (page - 1)*limit;

    delete req.query.page;
    delete req.query.size;

    let opt = {limit:limit, skip:skip};

    let cmd = [];

    Object.keys(req.query).forEach(e => req.query[e] = (parseInt(req.query[e])) ? parseInt(req.query[e]) : req.query[e]);

    cmd.push(repository.find(req.query, {}, opt));
    cmd.push(repository.count(req.query));

    Promise.all(cmd).then(
        result=>{
            let pg = new domain.Paginator(page, limit, result[1]);
            return res.send({data:result[0], pg:pg});          
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