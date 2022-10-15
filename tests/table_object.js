const mongoose = require( 'mongoose' );
require('../app_api/models/db');  //init mongoose

const Query_serv = require('../app_api/services/table_object');

mongoose.connection.on('connected', async () => {   

    let q = require('./table_object.json');

    //exec_func_from_1_day_every_day
    let qres = await Query_serv.select( q, new Date("2022-07-01T04:00:00Z"), new Date("2022-07-02T04:00:00Z"));       
    let data = Query_serv.applyTemplate(q, qres);

    console.log(data)    
    
    process.exit(0);

});