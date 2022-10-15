const Entity = require('../models/excel-report')
const BaseController = require('../controllers/base-controller')

//class NewController extends BaseController {
module.exports = new BaseController(Entity);