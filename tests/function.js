const mongoose = require( 'mongoose' );
require('../app_api/models/db');  //init mongoose
const Func = require('../app_api/models/function');
const Func_serv = require('../app_api/services/function');

mongoose.connection.on('connected', async () => {   
/*
    for (let index = 0; index < 90; index++) {
        let data = await Func_serv.calc(index+1, new Date("2022-05-30T04:00:00Z"));
        console.log(data)    
    }
*/
    //let data = await Func_serv.calc( 147, new Date("2022-06-28T04:00:00Z"));
/*
    let data = await Func_serv.call( {
        _id:239,
        params:[357,367,377,387],
        short_name: "rotate_compressor_avg_kc"
    }, new Date("2022-06-30T04:00:00Z"));
*/
/*
    let data = await Func_serv.call( {
        _id:239,
        params:[239],
        short_name: "findActualState"
    }, new Date("2022-05-28T04:00:00Z"));
*/

    let data = await Func_serv.calc(167, new Date("2020-08-18T04:00:00Z"));

    console.log(data)    

    process.exit(0);
});