const mongoose = require( 'mongoose' );
require('../app_api/models/db');  //init mongoose
const ReportService = require('../app_api/services/report');
const ExcelService = require('../app_api/services/excel');
const fs = require('fs');
const ReportNotFixedService = require('../app_api/services/report_not_fixed');

const Report_cfg = require('../app_api/models/excel-report');

mongoose.connection.on('connected', async () => {   

    let begin = new Date("2022-07-01T04:00:00Z");
    let end = new Date("2022-07-02T04:00:00Z");
/*
    if (report_cfg.fixed_rowset) {
        let data = await ReportService.create(report_cfg, begin, end);
        let stream = await ExcelService.create(data, report_cfg.template);
        console.log(stream);
        let html = await ExcelService.create_html(data, report_cfg.template);
        console.log(html);
        fs.writeFileSync('xls/test.html', html)

    } else {
        let data = await ReportNotFixedService.create(report_cfg, begin, end);
        let stream = await ExcelService.create(data, report_cfg.template);
        console.log(stream);
        //console.log(data);
        let html = await ExcelService.create_html(data, report_cfg.template);
        console.log(html);
        fs.writeFileSync('xls/test.html', html)    
    }
*/
    //let html = await ExcelService.create_html_table_header("xls/2.xlsx", 2);

    let report_cfg = await Report_cfg.findById(10).exec();
    let data = await ReportNotFixedService.create(report_cfg, begin, end);
    console.log(data);
    
    //fs.writeFileSync('xls/test.html', html);  

    process.exit(0);
});

