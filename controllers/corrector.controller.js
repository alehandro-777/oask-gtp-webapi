const DataTypes = require('../models/data.classes');
const dataservice = require('../1');

// Create and Save a new Object
exports.create = (req, res) => {

    if(!req.body.name) {
        return res.status(400).send({
            message: "Entity name can not be empty"
        });
    }
    if(!req.body.chNumber) {
        return res.status(400).send({
            message: "Corrector channels# can't be empty"
        });
    }

    let data = dataservice.addCorrector(req.body.id, req.body.name, req.body.ftype,
        req.body.addr, req.body.chNumber);

    return res.send(data);
};

// Retrieve and return all or page#.
exports.select = (req, res) => {

    let data = dataservice.getCorrectors();
    if(!data) {
        return res.status(404).send({
            message: "Empty collection !!! "
        });            
    }

    let pagesize = parseInt(req.query.size);
    let page = parseInt(req.query.page);   

    let chunk = data;
    let paginator = new DataTypes.Paginator(1, data.length, data);

    if(page>0 && pagesize>0){
        paginator = new DataTypes.Paginator(page, pagesize, data);
        start = pagesize*(page - 1);
        chunk = data.slice( start, start+pagesize);
    }    

    if(req.query.include){
        let includes  = req.query.include.split(",");
        let fixedArray = [];
        for(let i=0;i<chunk.length;i++){
            
            let fdata = {};
            for(let j=0;j<includes.length;j++){
                let prop = includes[j];
                fdata[prop] = chunk[i][prop];
            }
            fixedArray.push(fdata);    
        }
        return res.send({data:fixedArray, config:paginator});            
    }

    return res.send({data:chunk, config:paginator});        
       

};

// Find a single object with a Id
exports.findOne = (req, res) => {
    let id = parseInt(req.params.id);
    let data = dataservice.getCorrectorById(id);
    if(!data) {
        return res.status(404).send({
            message: "Object not found with id: " + req.params.id
        });            
    }
    res.send(data);
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Object body can not be empty"
        });
    }
    let id = parseInt(req.params.id);
    let data = dataservice.getCorrectorById(id);

    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }
    Object.assign(data, req.body);

    res.send(data);
};

// Delete a object with the specified noteId in the request
exports.delete = (req, res) => {
    let id = parseInt(req.params.id);
    let data = dataservice.getCorrectorById(id);

    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }
    dataservice.deleteCorrector(id);
    res.send({message: "Object deleted successfully!"});
};

// Update a object identified by the noteId in the request
exports.partialupdate = (req, res) => {
    
    if(!req.body) {
        return res.status(400).send({
            message: "Object body can not be empty"
        });
    }
    let id = parseInt(req.params.id);
    let data = dataservice.getCorrectorById(id);

    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }
    Object.assign(data, req.body);

    res.send(data);

};