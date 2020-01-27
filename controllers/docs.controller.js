const tmpprocessor = require('../template.processor');
const repository = require('../repository');
const xml2js = require('xml2js');


// POST
exports.create = (req, res) => {
    let result;
    
    try{
        let values = tmpprocessor.estract(req.body.request);
        result = {...values};
        result.bodyStr = JSON.stringify(req.body);
        result.created = new Date();
        repository.create(result.doc, result).then(
            result=>{
                var builder = new xml2js.Builder();
                var xmlOk = builder.buildObject({message: "Document created Ok"});
                res.set('Content-Type', 'text/xml');
                return res.send(xmlOk);          
            },
            error=>{
                return res.status(500).send(error);        
            }
        ).catch(
            error=>{
                return res.status(500).send(error);
            });
     
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
    let date = req.query.date;

    repository.findOne(collection, { date : date  }).then(//repository.findOne(collection, { "date": { $gte: date } }).then(
        result=>{
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(JSON.parse(result.bodyStr));

            res.set('Content-Type', 'text/xml');
            return res.send(xml);    
        }
    ).catch(
        error=>{
            return res.status(500).send(error);
        }
    );
};

// PUT
exports.update = (req, res) => {
    try{
  //      var result = processreq(req.body.request);
        

        
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

