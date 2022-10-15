const Entity = require('../models/value')
const BaseController = require('../controllers/base-controller')
const valuesService = require('../services/valuesService')

const materialisationService = require('../services/materialisation')

class ValuesController extends BaseController {
    constructor(pnt) {
        super(pnt);
    }

    async create (req, res) {
    
        if(!req.body) return res.status(400).json({ message: "Empty body"});       
        try {
            const data = await this.Entity.create(req.body);           
            await materialisationService.update_last_value(data.point, data.time_stamp);
            await materialisationService.update_previous_value([data.point], data.time_stamp);
            //await materialisationService.update_sum_from_1_month_day([data.point], data.time_stamp);

            return res.status(200).json({ data });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }  

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
        
        async cur_and_prev(req, res){
            if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
            
            try {
                const ts = req.query.time_stamp ? new Date(req.query.time_stamp) : new Date();      
                const data = await valuesService.findCurrentAndPrevious(+req.params.id, ts);           

                return res.status(200).json({ data });
            } 
            catch (error) {
                return res.status(500).json({ message: error});
            }  
        }

}


module.exports = new ValuesController(Entity);