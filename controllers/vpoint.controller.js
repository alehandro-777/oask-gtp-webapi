const DataTypes = require('../models/data.classes');
const dataservice = require('../1');
const CalcLine = require('../models/calcline.class');

// Create and Save a new Object
exports.create = (req, res) => {

    if(!req.body.name) {
        return res.status(400).send({
            message: "Entity Name can not be empty"
        });
    }

    let data = dataservice.addVirtualPoint(req.body.id, req.body.name, req.body.eic);
    return res.send(data);
};

// Retrieve and return all or page#.
exports.select = (req, res) => {

    let data = dataservice.getvPoints();
    if(!data) {
        return res.status(404).send({
            message: "Empty collection !!! "
        });            
    }

    let pagesize = parseInt(req.query.size);
    let page = parseInt(req.query.page);   
    
    let start;
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
    let data = dataservice.getvPointById(id);
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
    let data = dataservice.getvPointById(id);

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
    let data = dataservice.getvPointById(id);

    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }
    dataservice.deletevPoint(id);
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
    let data = dataservice.getvPointById(id);

    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }
    Object.assign(data, req.body);

    res.send(data);

};

exports.selectClines = (req, res)=>{
    let id = parseInt(req.params.id);
    let data = dataservice.getvPointById(id);

    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }
    console.log(data.calcLines);
    let lines = [];
    data.calcLines.forEach(function (line) {
        let newLine = new CalcLine(line.id, line.pointId);
        Object.assign(newLine, line);
        newLine.pointId = dataservice.getPoint(line.pointId);
        lines.push(newLine);
    });
    console.log(lines);
    res.send(lines);
}

exports.createCline = (req, res)=>{
    let id = parseInt(req.params.id);
    let data = dataservice.getvPointById(id);

    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }

    let mpointId = parseInt(req.body.mpointId);
    let mpoint = dataservice.getPoint(mpointId);
    if(mpointId === id) {
        return res.status(400).send({
            message: "Error, can't be id = pointId"
        });
    }
    if(!mpoint) {
        return res.status(400).send({
            message: "Invalid measure point Id"
        });
    }
    data.addCalcLine(mpoint);
    res.send(data);
}

exports.deleteCline = (req, res)=>{
    let id = parseInt(req.params.id);
    let data = dataservice.getvPointById(id);


    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }

    let lid = parseInt(req.params.lid);
    let line = data.selectCalcLineById(lid);

    if(!line) {
        return res.status(404).send({
            message: "Line not found with id " + req.params.lid
        });
    }

    data.deleteCalcLine(lid);
    res.send({message: "Object deleted successfully!"});
}

exports.updateCline = (req, res)=>{
    let id = parseInt(req.params.id);
    let data = dataservice.getvPointById(id);


    if(!data) {
        return res.status(404).send({
            message: "Object not found with id " + req.params.id
        });
    }
    let lid = parseInt(req.params.lid);
    let line = data.selectCalcLineById(lid);

    if(!line) {
        return res.status(404).send({
            message: "Line not found with id " + req.params.lid
        });
    }
    if(!req.body) {
        return res.status(400).send({
            message: "Entity Body can not be empty"
        });
    }
    Object.assign(line, req.body);

    res.send(line);
}

exports.calculate = (req, res)=>{
    dataservice.calcVirtualPoints();
    res.send({
        message: "Success vitual point values "
    });
}

