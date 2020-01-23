const processreq = require('../template.processor');
const repository = require('../repository');
const xml2js = require('xml2js');
var parseString = require('xml2js').parseString;


// POST
exports.create = (req, res) => {
    console.log(req.body);

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(req.body);
    res.set('Content-Type', 'text/xml');
    return res.send(xml);  

    //res.send(req.body);
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
    console.log(req.body)
    return res.send(req.body);

};

// PUT
exports.update = (req, res) => {
    console.log(req.body)
    return res.send(req.body);
};


// DELETE
exports.delete = (req, res) => {
    console.log(req.body)
    return res.send(req.body);
};

