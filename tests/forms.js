const mongoose = require( 'mongoose' );
require('../app_api/models/db');  //init mongoose

const Form_serv = require('../app_api/services/forms');

mongoose.connection.on('connected', async () => {   

//    let data = await Form_serv.read(2, new Date("2022-06-01T04:00:00Z"));
    let data = await Form_serv.config(5);
    console.log(data)    


    process.exit(0);
});