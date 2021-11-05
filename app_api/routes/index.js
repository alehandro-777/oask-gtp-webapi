const express = require('express')
const jwt = require('express-jwt');

const auth_controller = require('../controllers/auth')
const user_controller = require('../controllers/users')
const value_controller = require('../controllers/values')
const dbpoint_controller = require('../controllers/db-points')

const router = express.Router()

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        // authenticate JWT token and attach user to request object (req.user) RSA_PUBLIC_KEY
        jwt({ secret : process.env.RSA_PUBLIC_KEY, algorithms: ['RS256'] }),
        
        // authorize based on user role
        (req, res, next) => {

            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
        
    ];
}

router.route('/auth/login').post( auth_controller.login )

//----------------------------
router.route('/users')
  .get( user_controller.select )
  .post( user_controller.create );

router.route('/users/:id')
  .get( user_controller.findOne )
  .put( user_controller.update )
  .delete( user_controller.delete );

//----------------------------
router.route('/db-points')
  .get( dbpoint_controller.select )
  .post( dbpoint_controller.create );

router.route('/db-points/:id')
  .get( dbpoint_controller.findOne )
  .put( dbpoint_controller.update )
  .delete( dbpoint_controller.delete );

//----------------------------
router.route('/values')
  .get( value_controller.select )
  .post( value_controller.create );

router.route('/values/:id')
  .get( value_controller.findOne )
  .put( value_controller.update )
  .delete( value_controller.delete );


module.exports =  router 