const Point = require('../models/db-point')
const BaseController = require('../controllers/base-controller')
const valuesService = require('../services/valuesService')

class DbPointsController extends BaseController {
    constructor(pnt) {
        super(pnt);
    }
    
    //get all value changes for time point
    async changes(req, res)   {

        const time_stamp = req.query.time_stamp ? new Date(req.query.time_stamp) : new Date();

        try {
            const data = await await valuesService.findValueChanges(+req.params.id, time_stamp );
            if(data.length==0) return res.status(404).json({ message: "No values"});

            return res.status(200).json({ data });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }
    
    //get actual point value for time point
    async value(req, res)   {
        if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
        const time_stamp = req.query.time_stamp ? new Date(req.query.time_stamp) : new Date();

        try {
            const data = await valuesService.findActualValue(+req.params.id, time_stamp );
            
            if(data.length==0) return res.status(404).json({ message: "No value"});
            
            return res.status(200).json({ data:data[0] });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }

    async state(req, res)   {
        if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
        const time_stamp = req.query.time_stamp ? new Date(req.query.time_stamp) : new Date();

        try {
            const data = await valuesService.findActualState(+req.params.id, time_stamp );
            
            if(data.length==0) return res.status(404).json({ message: "No value"});
            
            return res.status(200).json({ data:data[0] });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }

}//----------- end class ----------------------------------------------

module.exports = new DbPointsController(Point);