const ReportService = require('../services/report');
const ReportNotFixService = require('../services/report_not_fixed');
const ExcelService = require('../services/excel');
const ExcelReportCfg = require('../models/excel-report');

class TablesController {
    constructor() { }
    
    //-------------------------------------------------------------------------------------------------------------
    async html(req, res)   {
        if (!req.query.begin) return res.status(400).json({ message: "Miss begin ISO fmt: ..&begin==2021-12-01"});       
        if (!req.query.end) return res.status(400).json({ message: "Miss end ISO fmt: ..&end==2021-12-01"});       

        if (!req.query.id) return res.status(400).json({ message: "Miss id"});       

        try {
            const report_cfg = await ExcelReportCfg.findById(+req.query.id).exec();

            if (!report_cfg) return res.status(404).json({ message: "Report cfg not found"});;

            let begin = new Date(req.query.begin);
            let end = new Date(req.query.end);
            let cells = [];

            if (report_cfg.fixed_rowset) {
                cells = await ReportService.create(report_cfg, begin, end);
            } else {
                cells = await ReportNotFixService.create(report_cfg, begin, end);
            }            

            let html = await ExcelService.create_html(cells, report_cfg.template);
            
            res.setHeader('Content-Type', 'text/html');
            return res.send(html);
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }

    async excel (req, res) { 
        if (!req.query.begin) return res.status(400).json({ message: "Miss begin ISO fmt: ..&begin==2021-12-01"});       
        if (!req.query.end) return res.status(400).json({ message: "Miss end ISO fmt: ..&end==2021-12-01"});       

        if (!req.query.id) return res.status(400).json({ message: "Miss id"});       

        try {
            const report_cfg = await ExcelReportCfg.findById(req.query.id);
            if (!report_cfg) return res.status(404).json({ message: "Report cfg not found"});

            let begin = new Date(req.query.begin);
            let end = new Date(req.query.end);
            let cells = [];

            if (report_cfg.fixed_rowset) {
                cells = await ReportService.create(report_cfg, begin, end);
            } else {
                cells = await ReportNotFixService.create(report_cfg, begin, end);
            }

            const stream = await ExcelService.create(cells, report_cfg.template);


            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=temp.xlsx");
            stream.pipe(res);
    } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }



}

module.exports = new TablesController();