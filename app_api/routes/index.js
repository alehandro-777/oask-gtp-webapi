const express = require('express')
const jwt = require('express-jwt');

const auth_controller = require('../controllers/auth')
const user_controller = require('../controllers/users')
const value_controller = require('../controllers/values')
const dbpoint_controller = require('../controllers/db-points')

const roles_controller = require('../controllers/roles')
const di_states_controller = require('../controllers/di-states')
const user_profiles_controller = require('../controllers/user-profiles')

const table_controller = require('../controllers/tables')

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


//---------------------------- TEST TEST TEST   !!!!!!!!!!!!!!!
router.route('/tables').get( async (req,res)=> table_controller.select(req,res) );
router.route('/tables1').get( async (req,res)=> table_controller.select1(req,res) );
router.route('/html').get( async (req,res)=> table_controller.html(req,res) );
router.route('/excel').get( async (req,res)=> table_controller.excel(req,res) );

//----------------------------
router.route('/users')
  .get( (req,res)=>user_controller.select(req,res) )
  .post( (req,res)=>user_controller.create(req,res) );

router.route('/users/:id')
  .get( (req,res)=>user_controller.findOne(req,res) )
  .put( (req,res)=>user_controller.update(req,res) )
  .delete( (req,res)=>user_controller.delete(req,res) );

//----------------------------
router.route('/db-points')
  .get( (req,res)=>dbpoint_controller.select(req,res) )
  .post( (req,res)=>dbpoint_controller.create(req,res) );

router.route('/db-points/:id')
  .get( (req,res)=>dbpoint_controller.findOne(req,res) )
  .put( (req,res)=>dbpoint_controller.update(req,res) )
  .delete( (req,res)=>dbpoint_controller.delete(req,res) );

router.route('/db-points/:id/value')
  .get( async (req,res)=> dbpoint_controller.value(req,res) );

router.route('/db-points/:id/state')
  .get( async (req,res)=> dbpoint_controller.state(req,res) );

router.route('/db-points/:id/changes')
  .get( async (req,res)=> dbpoint_controller.changes(req,res) );

router.route('/db-points/:id/calc')
  .get( async (req,res)=> dbpoint_controller.calc(req,res) );

//----------------------------
router.route('/values')
  .get( (req,res)=>value_controller.select(req,res) )
  .post( (req,res)=>value_controller.create(req,res) );

router.route('/values/table').get( (req,res)=>value_controller.selectTable(req,res) );
router.route('/values/table/stats').get( (req,res)=>value_controller.selectTableStats(req,res) );

router.route('/values/:id')
  .get( (req,res)=>value_controller.findOne(req,res) )
  .put( (req,res)=>value_controller.update(req,res) )
  .delete( (req,res)=>value_controller.delete(req,res) );

//----------------------------
router.route('/profiles')
  .get( (req,res)=>user_profiles_controller.select(req,res) )
  .post( (req,res)=>user_profiles_controller.create(req,res) );

router.route('/profiles/:id')
  .get( (req,res)=>user_profiles_controller.findOne(req,res) )
  .put( (req,res)=>user_profiles_controller.update(req,res) )
  .delete( (req,res)=>user_profiles_controller.delete(req,res) );
//----------------------------
router.route('/states')
  .get( (req,res)=>di_states_controller.select(req,res) )
  .post( (req,res)=>di_states_controller.create(req,res) );

router.route('/states/:id')
  .get( (req,res)=>di_states_controller.findOne(req,res) )
  .put( (req,res)=>di_states_controller.update(req,res) )
  .delete( (req,res)=>di_states_controller.delete(req,res) );
//----------------------------
router.route('/roles')
  .get( (req,res)=>roles_controller.select(req,res) )
  .post( (req,res)=>roles_controller.create(req,res) );

router.route('/roles/:id')
  .get( (req,res)=>roles_controller.findOne(req,res) )
  .put( (req,res)=>roles_controller.update(req,res) )
  .delete( (req,res)=>roles_controller.delete(req,res) );


module.exports =  router 