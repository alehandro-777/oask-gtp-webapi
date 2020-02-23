const repository = require('../repo/correct.repo');

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

exports.select = (req, res) => {

    repository.find().then(
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

exports.findOne = (req, res) => {

    let id = req.params.id;
    let dt = req.query.dt;

    //let dt = new Date("2023-03-19T12:00:00.000Z");
    //{ $gte: '1987-10-19', $lte: '1987-10-26' }

    repository.findOne({flid : id}).then(
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