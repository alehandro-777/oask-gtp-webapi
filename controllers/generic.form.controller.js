const express = require('../index');
const grepository = require('../repo/generic.repo');

// POST
exports.create = (req, res) => {
    let schema_name = req.params.id;
    let model = express.mongoose.model(schema_name);
    let repository = grepository.create(model);

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
exports.findOne = (req, res) => {
    let schema_name = req.params.id;
    let model = express.mongoose.model(schema_name);
    let repository = grepository.create(model);
 
    Object.keys(req.query).forEach(e => req.query[e] = (parseInt(req.query[e])) ? parseInt(req.query[e]) : req.query[e]);


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

exports.select = (req, res) => {
    let schema_name = req.params.id;
    let model = express.mongoose.model(schema_name);
    let repository = grepository.create(model);

    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.size);
    let skip = (page - 1)*limit;

    delete req.query.page;
    delete req.query.size;

    let opt = {limit:limit, skip:skip};

    let cmd = [];

    Object.keys(req.query).forEach(e => req.query[e] = (parseInt(req.query[e])) ? parseInt(req.query[e]) : req.query[e]);

    cmd.push(repository.find(req.query, {}, opt));
    cmd.push(repository.count());

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
exports.update = (req, res) => {
    let schema_name = req.params.id;
    let model = express.mongoose.model(schema_name);
    let repository = grepository.create(model);


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
exports.delete = (req, res) => {
    let schema_name = req.params.id;
    let model = express.mongoose.model(schema_name);
    let repository = grepository.create(model);

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
