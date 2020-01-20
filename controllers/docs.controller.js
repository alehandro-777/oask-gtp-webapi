const processreq = require('../template.processor');
const repository = require('../repository');
const xml2js = require('xml2js');
var parseString = require('xml2js').parseString;


// POST
exports.create = (req, res) => {
    try{
        let doc = req.params.id;
        let date = new Date(req.query.date);

        repository.findOne("templates", { doc : doc  }).then(
            result=>{
                        parseString(result.xml, function (err, result) {
                            result.date = date;
                            var r = processreq(result.request);                            
                            var builder = new xml2js.Builder();
                            var xml = builder.buildObject(r);
                            r.xml = xml;
                            r.created = Date();
                            repository.create(r.doc, r).then(
                                result=>{
                                    res.set('Content-Type', 'text/xml');
                                    return res.send(result.ops[0].xml);          
                                },
                                error=>{
                                    return res.status(500).send(error);        
                                }
                            );           
                        });
                
                    },
            error=>{
                console.log(error);
            }
        );      
    }
    catch(err){
        return res.status(500).send(err);
    }

};

// GET
exports.select = (req, res) => {

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <response>  
      <date>2022-09-01</date>
      <time>12:01:00.333</time>
      <version>2022-09-01</version>  
      <doc>OGU.PROLETARSKE.REGIM.HOUR</doc>    
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>        

      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>        

      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>
      <row>
          <col1 id="P-00-00-01">56.7</col1>
          <col2 id="P-00-00-02">56.7</col2>
          <col3 id="P-00-00-03">56.7</col3>
          <col4 id="P-00-00-04">56.7</col4>
      </row>        


      </response>`;

    res.set('Content-Type', 'text/xml');       
    return res.send(xml);             
};


// GET with a Id
exports.findOne = (req, res) => {

    let collection = req.params.id;
    let date = new Date(req.query.date);

    try{
        repository.findOne(collection, { date : date  }).then(//repository.findOne(collection, { "date": { $gte: date } }).then(
            result=>{
                res.set('Content-Type', 'text/xml');
                return res.send(result.xml);    
                    },
            error=>{
                return res.status(500).send(error);
            }
        );
    }
    catch(err){
        return res.status(500).send(err);
    }
};

// PUT
exports.update = (req, res) => {

    try{
        var result = processreq(req.body.request);

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(req.body);
        result.xml = xml;
        result.created = new Date();

        repository.create(result.doc, result).then(
            result=>{
                var xmlOk = builder.buildObject({message: result.ops[0].doc + " updated Ok"});
                res.set('Content-Type', 'text/xml');
                return res.send(xmlOk);  
            },
            error=>{
                return res.status(500).send(error);        
            }
        );
    }
    catch(err){
        return res.status(500).send(err);
    }
};


// DELETE
exports.delete = (req, res) => {
    res.send();
};

