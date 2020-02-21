const repository = require('../repo/day.data.repo');

exports.create = (req, res) => {

    let collection = req.params.id;

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