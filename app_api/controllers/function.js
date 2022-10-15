const Func = require('../models/function')
const FuncResult = require('../models/func-result')
const BaseController = require('../controllers/base-controller')
const FuncServices = require('../services/function')

class FunctionController extends BaseController {
    constructor(pnt) {
        super(pnt);
    }
    
    async calc(req, res)   {
        if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});

        const ts = req.query.time_stamp ? new Date(req.query.time_stamp) : new Date();

        try {
            let value = await FuncServices.calc(+req.params.id, ts);

            await FuncResult.create(value);// ??? TODO save results for test

            return res.status(200).json({ data: value });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }
    
    async call(req, res)   {
        if (!req.query.point) return res.status(400).json({ message: "Miss query point id"});
        if (!req.query.time_stamp) return res.status(400).json({ message: "Miss query date time"});
        if (!req.query.name) return res.status(400).json({ message: "Miss query func name"});

        try {
            const ts =  new Date(req.query.time_stamp);

            let func = {};
            func._id = +point;
            func.short_name = func_name;
            func.params = [+point];

            let value = await FuncServices.call(func, ts);

            await FuncResult.create(value); // ??? TODO save results for test

            return res.status(200).json({ data: value });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }
}

module.exports = new FunctionController(Func);