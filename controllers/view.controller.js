let repository;


// GET VIEW
exports.findOne = (req, res) => {
    
    req.query = { ...req.params};

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