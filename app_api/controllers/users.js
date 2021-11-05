const Entity = require('../models/user')

module.exports.create = function (req, res) {
    
    if(!req.body) return res.status(400).json({ message: "Empty body"});
    
    Entity.create(req.body, (err, data)=>{
        if(err) res.status(500).json({ message: err});
        
        res.status(201).json({ data: data});
    } );          
 };

module.exports.update = function (req, res) {

    if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
    if(!req.body) return res.status(400).json({ message: "Empty body"});

    Entity.findById(req.params.id).exec( (err, entity)=>{

        if(err) return res.status(500).json({ message: err});

        if(!entity) return res.status(404).json({ message: "Not found"});
  
        Object.assign(entity, req.body);

        entity.save( (err, data)=>{
            if(err) return res.status(500).json({ message: err});
            return res.status(200).json({ data: data});
        });
    } );          
 };

module.exports.delete = function (req, res) {

    if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});

    Entity.findByIdAndRemove(req.params.id).exec( (err) => {

                if (err) return res.status(500).json({ message: err});
              
                return res.status(204).json({ data: null});
            } 
        )
};

module.exports.findOne = function (req, res) { 
    
    if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});

        Entity.findById(req.params.id).exec( (err, data) => {                

                if (err)  return res.status(500).json({ message: err});

                if (!data) return res.status(404).json({ message: "Not found"});

                return res.status(200).json({ data: data });
            }
        )
};

module.exports.select = function (req, res) {  
    //console.log(req.query);
    
    let {skip=0, limit=100, fields, sort, ...filter} = req.query;

    if(fields) fields = fields.replace(/,/g, " ");

    Entity.find(filter).countDocuments( (err, total)=> {
        
        if (err) return res.status(500).json({ message: err});

        Entity.find(filter).select(fields).skip(+skip).limit(+limit).sort(sort).exec( (err, data) => {

                if (err) return res.status(500).json({ message: err});

                return res.status(200).json({ limit, total, data });
            } 
        )  

    } );

};