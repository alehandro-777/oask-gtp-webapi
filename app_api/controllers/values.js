const Entity = require('../models/value')
const BaseController = require('../controllers/base-controller')
const valuesService = require('../services/valuesService')

class ValuesController extends BaseController {
    constructor(pnt) {
        super(pnt);
    }

        async selectTable(req, res){

            if (!req.query.begin) return res.status(400).json({ message: "Miss date ISO fmt: ..&begin==2021-12-01T07:00"});
            if (!req.query.end) return res.status(400).json({ message: "Miss date ISO fmt: ..&end==2021-12-01T07:00"});
            if (!req.query.points) return res.status(400).json({ message: "Miss params : ..&points=[1,2...n]"});
    
            try {
                const begin = new Date(req.query.begin);
                const end = new Date(req.query.end);
    
                const points = JSON.parse(req.query.points);
                const data = await valuesService.selectTable(points, begin, end);           
                return res.status(200).json({ data });
            } 
            catch (error) {
                return res.status(500).json({ message: error});
            }  
        }
        async selectTableStats(req, res){

            if (!req.query.begin) return res.status(400).json({ message: "Miss date ISO fmt: ..&begin==2021-12-01T07:00"});
            if (!req.query.end) return res.status(400).json({ message: "Miss date ISO fmt: ..&end==2021-12-01T07:00"});
            if (!req.query.points) return res.status(400).json({ message: "Miss params : ..&points=[1,2...n]"});
    
            try {
                const begin = new Date(req.query.begin);
                const end = new Date(req.query.end);
    
                const points = JSON.parse(req.query.points);
                const data = await valuesService.tableStats(points, begin, end);           
                return res.status(200).json({ data });
            } 
            catch (error) {
                return res.status(500).json({ message: error});
            }  
        }
}


module.exports = new ValuesController(Entity);