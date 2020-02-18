const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const xmlparser = require('express-xml-bodyparser');
const config = require('config');

const app = express();

const expressJwt = require('express-jwt');

const RSA_PUBLIC_KEY = fs.readFileSync('./keys/public.key');

const checkIfAuthenticatedFunc = expressJwt({
    secret: RSA_PUBLIC_KEY
});


app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(xmlparser());

app.get('/', (req, res) => {
  res.json({"message": "Welcome to Hostlib center web API"});
});

// a middleware function with no mount path. This code is executed for every request to the router
app.use(function (req, res, next) {
    //console.log('Time:', Date.now(), ' : ', req);
    next();
  });

// Require app routes
require('./routes/app.routes')(app, checkIfAuthenticatedFunc);

//export NODE_ENV=prod
//node my-app.js

app.listen(appConfig.Port, function () {
  console.log('Web API listening on port 3000!');
});
