
// Create and Save a new Object
exports.create = (req, res) => {

    if(!req.body.name) {
        return res.status(400).send({
            message: "Entity name can not be empty"
        });
    }

    return res.send(;
};

// Retrieve and return all or page#.
exports.select = (req, res) => {

    if(!data) {
        return res.status(404).send({
            message: "Empty collection !!! "
        });            
    }
    return res.send();             
};

// Find a single object with a Id
exports.findOne = (req, res) => {
    res.send();
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Object body can not be empty"
        });
    }
    res.send();
};

// Delete a object with the specified noteId in the request
exports.delete = (req, res) => {
    res.send();
};

// Update a object identified by the noteId in the request
exports.partialupdate = (req, res) => {
    
    if(!req.body) {
        return res.status(400).send({
            message: "Object body can not be empty"
        });
    }
    res.send();
};