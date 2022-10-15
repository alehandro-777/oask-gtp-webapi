const Entity = require('../models/block-input')
const BaseController = require('../controllers/base-controller')
const inputBlockService = require('../services/inputBlock')

class BlockInputController extends BaseController {
    constructor(pnt) {
        super(pnt);
    }
    async create (req, res) {    
        if(!req.body) return res.status(400).json({ message: "Empty body"});       
        try {
            const data = await this.Entity.create(req.body);           
            await inputBlockService.packTable(data.role, data.time_stamp);           
            return res.status(200).json({ data });
        } 
        catch (error) {
            return res.status(500).json({ message: error});
        }  

     }

}

module.exports = new BlockInputController(Entity);