const mongoose = require( 'mongoose' );
require('../app_api/models/db');  //init mongoose
const Query_serv = require('../app_api/services/query');

mongoose.connection.on('connected', async () => {   

    //let data = await Query_serv.exec( 5, new Date("2022-05-01T04:00:00Z"), new Date("2022-05-31T04:00:00Z"));

    //exec_func_from_1_day_every_day
    let data = await Query_serv.exec( 20, new Date("2022-07-03T04:00:00Z"), null);   
    
    //console.log(data)    
    
    process.exit(0);

});