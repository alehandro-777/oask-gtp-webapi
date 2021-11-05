const fs = require('fs')
process.env.RSA_PUBLIC_KEY = fs.readFileSync('./keys/public.key');
process.env.RSA_PRIVATE_KEY = fs.readFileSync('./keys/private.key');

const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./error-handler')
const app = express()
const router = require('./app_api/routes')

require('./app_api/models/db')  //init mongoose

const port = process.env.PORT || 3000;

//temp
app.use(function (req, res, next) {
    //console.log(req.headers);
    next();
  });

//middleware
app.use(cors());
app.use(bodyParser.json())
app.use('/api', router)
app.use(errorHandler);  // global error handler

console.log(`Server started at port: ${port}`)
app.listen(port)