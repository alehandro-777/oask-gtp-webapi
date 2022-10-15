const mongoose = require( 'mongoose' );
require('../app_api/models/db');  //init mongoose

const service = require('../app_api/services/materialisation');

mongoose.connection.on('connected', async () => {   

    //let data = await service.update_active_gas_period([152, 173, 174], new Date("2022-05-01T04:00:00Z"));

    //let data = await service.update_sum_from_1_d_period( [152], new Date("2022-05-01T04:00:00Z"));     
    
    let data = await service.update_previous_period ( [152], new Date("2022-05-01T04:00:00Z"));     
    
    console.log(data)    


    process.exit(0);
});