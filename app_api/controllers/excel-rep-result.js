const Entity = require('../models/excel-rep-result')
const BaseController = require('../controllers/base-controller')

//class NewController extends BaseController {
module.exports = new BaseController(Entity);