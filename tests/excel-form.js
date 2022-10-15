const mongoose = require( 'mongoose' );
require('../app_api/models/db');  //init mongoose
const fs = require('fs');
const service = require('../app_api/services/excel-form');
const report = require('../app_api/models/excel-report');


mongoose.connection.on('connected', async () => {  

    //let data = await service.create_table('xls/form_11_fixed.xlsx', 2) //form_12_not_fixed.xlsx
    let cfg = await report.findById(115).exec();
    let data = await service.create(cfg, new Date("2022-07-18T04:00:00Z"), null);
    //let data = await service.edgeStates([359, 369, 379, 389], new Date("2022-06-01T04:00:00Z"), ".5");

    //let html = await service.create_table_header(cfg);
    
    //console.log(html);
    //console.log(data);
    
    //fs.writeFileSync('xls/test.html', html);  

    process.exit(0);    

})