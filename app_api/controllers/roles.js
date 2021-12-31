const Entity = require('../models/role')
const BaseController = require('../controllers/base-controller')

//class NewController extends BaseController {
module.exports = new BaseController(Entity);