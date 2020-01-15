


// POST
exports.create = (req, res) => {
    //return res.status(400).send({ message: "Entity name can not be empty" });
    return res.send();
};

// GET
exports.select = (req, res) => {
        //return res.status(404).send({
        //console.log(req.body); 

    req.body.request.row.forEach( function(item, i, arr) { 

        let date;

        function SelectSingle(p1, p2, p3, p4, p5)
        {
            console.log(p1);
            return 111;
        }

        //console.log(item.col[1]._); 
        try{
            let res = eval(item.col[1]._);
            console.log(res); 
        }
        catch{}

    });

    var xml2js = require('xml2js');
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(req.body);

    res.set('Content-Type', 'text/xml');       
    return res.send(xml);             
};



// GET with a Id
exports.findOne = (req, res) => {
    res.send();
};

// PUT
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Object body can not be empty"
        });
    }
    res.send();
};

// DELETE
exports.delete = (req, res) => {
    res.send();
};

// PATCH
exports.partialupdate = (req, res) => {
    
    if(!req.body) {
        return res.status(400).send({
            message: "Object body can not be empty"
        });
    }
    res.send();
};
