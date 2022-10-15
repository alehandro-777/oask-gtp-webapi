const Query = require('../models/query')
const BaseController = require('../controllers/base-controller')
const QueryService = require('../services/query')

class QueryController extends BaseController {
    constructor(pnt) {
        super(pnt);
    }

    async exec(req, res)   {
        if (!req.params.id) return res.status(400).json({ message: "Wrong query params"});

        try {
            const begin = req.query.begin ? new Date(req.query.begin) : new Date();
            const end = req.query.end ? new Date(req.query.end) : new Date();

            let value = await QueryService.exec(+req.params.id, begin, end);           

            return res.status(200).json({ data: value });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }       
    }
}

module.exports = new QueryController(Query);