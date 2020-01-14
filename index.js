const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({"message": "Welcome to REST web API"});
});

// Require app routes
require('./routes/app.routes')(app);

app.listen( 3000, function () {
    console.log('Web API listening on port 3000!');
  });



  