const Entity = require('../models/form')
const BaseController = require('../controllers/base-controller')
const ExcelService = require('../services/excel');
const FormsService = require('../services/forms');

//---- add 16-08-2022
const NewFormRepEntity = require('../models/excel-report');
const NewFormReportService = require('../services/excel-form');

class NewController extends BaseController {
    constructor(pnt) {
        super(pnt);
    }

    async html_head(req, res)   {
        try {
            const form_cfg = await Entity.findById(+req.params.id);
            if (!form_cfg) return res.status(404).json({ message: "Form cfg not found"});

            let html = await ExcelService.create_html_table_header(form_cfg.template, form_cfg.row_num);
            
            res.setHeader('Content-Type', 'text/html');
            return res.send(html);
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }

    async init(req, res)   {
        if (!req.query.time_stamp) return res.status(400).json({ message: "Miss query date time"});

        try {
            let values = await FormsService.read(+req.params.id, new Date(req.query.time_stamp));            
            return res.status(200).json({ data: values });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }

    async save(req, res)   {
        if (!req.query.time_stamp) return res.status(400).json({ message: "Miss query date time"});

        try {
            let r = await FormsService.save(req.body, new Date(req.query.time_stamp));            
            return res.status(200).json({ data: r });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        } 
    }

    async points(req, res)   {
        try {
            let values = await FormsService.config(+req.params.id);            
            return res.status(200).json({ data: values });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        } 
    }

    
//-------------------------------------- new 16-08-2022 -----------------
async html_head1(req, res)   {
    try {
        const form_cfg = await NewFormRepEntity.findById(+req.params.id);
        if (!form_cfg) return res.status(404).json({ message: "Form cfg not found"});

        let html = await NewFormReportService.create_table_header(form_cfg);
        
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }       
}

async rows(req, res)   {
    if (!req.query.begin) return res.status(400).json({ message: "Miss begin ISO fmt: ..&begin==2021-12-01"});       

    try {
        let begin = new Date(req.query.begin);
        let end = new Date(req.query.end);

        const form_cfg = await NewFormRepEntity.findById(+req.params.id);
        if (!form_cfg) return res.status(404).json({ message: "Form cfg not found"});

        let rows = await NewFormReportService.create(form_cfg, begin, end);
        return res.status(200).json({ data: rows });

    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }       
}

async export_xlsx(req, res)   {
    if (!req.query.begin) return res.status(400).json({ message: "Miss begin ISO fmt: ..&begin==2021-12-01"});       

    try {
        let begin = new Date(req.query.begin);
        let end = new Date(req.query.end);

        const form_cfg = await NewFormRepEntity.findById(+req.params.id);
        if (!form_cfg) return res.status(404).json({ message: "Form cfg not found"});

        let stream = await NewFormReportService.create_xlsx(form_cfg, begin, end);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=temp.xlsx");
        stream.pipe(res);
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    }       
}

async save_all(req, res)   {

    try {
        let r = await FormsService.save1(req.body);            
        return res.status(200).json({ data: r });
    } 
    catch (error) {
        return res.status(500).json({ message: error});
    } 
}

}    

module.exports = new NewController(Entity);