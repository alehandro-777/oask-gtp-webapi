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

    async calc(req, res)   {
        if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});
        const time_stamp = req.query.time_stamp ? new Date(req.query.time_stamp) : new Date();

        try {
            const point = await Point.findById(+req.params.id);
            
            if (!point) return res.status(404).json({ message: "Point Not found"});

            if (!point.func) return res.status(400).json({ message: "Point has not function"});

            let positive_ids = point.params.map(e=> Math.abs(e));

            const data = await valuesService.selectRow( positive_ids, time_stamp);

            if(data.length==0) return res.status(400).json({ message: "No operand(s)"});
            
            let value = this.exec_all(point, data);
            
            if(!value) return res.status(404).json({ message: "No operand(s)"});

            return res.status(200).json({ data: value });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }


    

    //exec func from point cfg ====================
    exec_all(point, data) {
        return eval("this."+point.func+"(point, data)");
    }

    summ(point, data) {
        //console.log(point.params, data, point.func);
        let total =0;
        
        for (let i = 0; i < point.params.length; i++) {
            const pnt = point.params[i];
            let k =  pnt < 0 ? -1 : 1;
            let api_data = data.find(d => d._id.point == Math.abs(pnt));
            if (!api_data) return null;
            total = total + k * api_data.value;
        }

        //console.log(data);

        let result = {};
        result.point = point._id;
        result.time_stamp = data[0]._id.time_stamp;
        result.value = total;
        result.state = 'Normal';
        result.deleted = false;

        return result;
    }

}//----------- end class ----------------------------------------------

module.exports = new DbPointsController(Point);