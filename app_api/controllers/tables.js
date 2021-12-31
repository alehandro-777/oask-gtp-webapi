const tableService = require('../services/tables/table_1')


class TablesController {
    constructor() {
    }

    async select(req, res)   {

        if (!req.query.gasday) return res.status(400).json({ message: "Miss gasday ISO fmt: ..&gasday==2021-12-01"});

        try {
            const data = await tableService.createNotFixed(req.query.gasday);

            return res.status(200).json({ data });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }
    async select1(req, res)   {

        if (!req.query.gasday) return res.status(400).json({ message: "Miss gasday ISO fmt: ..&gasday==2021-12-01"});

        try {
            const data = await tableService.createFixed(req.query.gasday);

            return res.status(200).json({ data });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }

    async html(req, res)   {

        if (!req.query.gasday) return res.status(400).json({ message: "Miss gasday ISO fmt: ..&gasday==2021-12-01"});

        try {
            const data = await tableService.createHtml(req.query.gasday);
            res.setHeader('Content-Type', 'text/html');
            return res.send(data);
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }

    async excel (req, res) { 
        if (!req.query.gasday) return res.status(400).json({ message: "Miss gasday ISO fmt: ..&gasday==2021-12-01"}); 
        try {
            const stream = await tableService.createExcelWorkBook(req.query.gasday);
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