const express = require('express')
const jwt = require('express-jwt');

const auth_controller = require('../controllers/auth')
const user_controller = require('../controllers/users')
const value_controller = require('../controllers/values')
const dbpoint_controller = require('../controllers/db-points')

const roles_controller = require('../controllers/roles')
const di_states_controller = require('../controllers/di-states')
const user_profiles_controller = require('../controllers/user-profiles')

const block_input_controller = require('../controllers/block-input')
const func_result_controller = require('../controllers/func-result')
const function_controller = require('../controllers/function')
const last_values_controller = require('../controllers/last-values')
const query_controller = require('../controllers/queries')
const excel_report_controller = require('../controllers/excel-report')
const excel_rep_result_controller = require('../controllers/excel-rep-result')
const block_inp_last_controller = require('../controllers/inp-block-last')
const forms_controller = require('../controllers/form')

const table_controller = require('../controllers/tables')

const value_prev_controller = require('../controllers/value-previous')
const value_1_d_month_controller = require('../controllers/value-1-m-day')


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

router.route('/html').get( async (req,res)=> table_controller.html(req,res));
router.route('/excel').get( async (req,res)=> table_controller.excel(req,res));




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

//----------------------------
router.route('/values')
  .get( (req,res)=>value_controller.select(req,res) )
  .post( (req,res)=>value_controller.create(req,res) );

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

//----------------------------
router.route('/functions')
  .get( (req,res)=>function_controller.select(req,res) )
  .post( (req,res)=>function_controller.create(req,res) );
router.route('/functions/:id')
  .get( (req,res)=>function_controller.findOne(req,res) )
  .put( (req,res)=>function_controller.update(req,res) )
  .delete( (req,res)=>function_controller.delete(req,res) );
router.route('/functions/:id/calc')
  .get( async (req,res)=> function_controller.calc(req,res) );

router.route('/functions/call')
  .get( async (req,res)=> function_controller.call(req,res) );

//----------------------------
router.route('/func-results')
  .get( (req,res)=>func_result_controller.select(req,res) )
  .post( (req,res)=>func_result_controller.create(req,res) );
router.route('/func-results/:id')
  .get( (req,res)=>func_result_controller.findOne(req,res) )
  .put( (req,res)=>func_result_controller.update(req,res) )
  .delete( (req,res)=>func_result_controller.delete(req,res) );

//----------------------------
router.route('/input-blocks')
  .get( (req,res)=>block_input_controller.select(req,res) )
  .post( (req,res)=>block_input_controller.create(req,res) );
router.route('/input-blocks/:id')
  .get( (req,res)=>block_input_controller.findOne(req,res) )
  .put( (req,res)=>block_input_controller.update(req,res) )
  .delete( (req,res)=>block_input_controller.delete(req,res) );

//----------------------------
router.route('/last-values')
  .get( (req,res)=>last_values_controller.select(req,res) )
  .post( (req,res)=>last_values_controller.create(req,res) );
router.route('/last-values/:id')
  .get( (req,res)=>last_values_controller.findOne(req,res) )
  .put( (req,res)=>last_values_controller.update(req,res) )
  .delete( (req,res)=>last_values_controller.delete(req,res) );

//----------------------------
router.route('/queries')
  .get( (req,res)=>query_controller.select(req,res) )
  .post( (req,res)=>query_controller.create(req,res) );
router.route('/queries/:id')
  .get( (req,res)=>query_controller.findOne(req,res) )
  .put( (req,res)=>query_controller.update(req,res) )
  .delete( (req,res)=>query_controller.delete(req,res) );
router.route('/queries/:id/exec')
  .get( async (req,res)=> query_controller.exec(req,res) );
 
//----------------------------
router.route('/excel-reports')
  .get( (req,res)=>excel_report_controller.select(req,res) )
  .post( (req,res)=>excel_report_controller.create(req,res) );
router.route('/excel-reports/:id')
  .get( (req,res)=>excel_report_controller.findOne(req,res) )
  .put( (req,res)=>excel_report_controller.update(req,res) )
  .delete( (req,res)=>excel_report_controller.delete(req,res) );
router.route('/excel-reports/:id/create')
  .get( async (req,res)=> excel_report_controller.create(req,res) );  

//----------------------------
router.route('/excel-rep-results')
.get( (req,res)=>excel_rep_result_controller.select(req,res) )
.post( (req,res)=>excel_rep_result_controller.create(req,res) );
router.route('/excel-rep-results/:id')
.get( (req,res)=>excel_rep_result_controller.findOne(req,res) )
.put( (req,res)=>excel_rep_result_controller.update(req,res) )
.delete( (req,res)=>excel_rep_result_controller.delete(req,res) );

//----------------------------
router.route('/input-blocks-last')
.get( (req,res)=>block_inp_last_controller.select(req,res) )
.post( (req,res)=>block_inp_last_controller.create(req,res) );
router.route('/input-blocks-last/:id')
.get( (req,res)=>block_inp_last_controller.findOne(req,res) )
.put( (req,res)=>block_inp_last_controller.update(req,res) )
.delete( (req,res)=>block_inp_last_controller.delete(req,res) );

//----------------------------
router.route('/forms')
.get( (req,res)=>forms_controller.select(req,res) )
.post( (req,res)=>forms_controller.create(req,res) );

router.route('/forms/:id')
.get( (req,res)=>forms_controller.findOne(req,res) )
.put( (req,res)=>forms_controller.update(req,res) )
.delete( (req,res)=>forms_controller.delete(req,res) );

router.route('/forms/:id/header').get( async (req,res)=> forms_controller.html_head(req,res)); // added 10-06-22
router.route('/forms/:id/init').get( async (req,res)=> forms_controller.init(req,res)); // added 13-06-22
router.route('/forms/:id/save').post( async (req,res)=> forms_controller.save(req,res)); // added 13-06-22
router.route('/forms/:id/points').get( async (req,res)=> forms_controller.points(req,res)); // added 13-06-22
//add 16-08-2022
router.route('/forms/:id/header1').get( async (req,res)=> forms_controller.html_head1(req,res)); // added 16-08-22
router.route('/forms/:id/rows').get( async (req,res)=> forms_controller.rows(req,res)); // added 16-08-22
router.route('/forms/:id/export').get( async (req,res)=> forms_controller.export_xlsx(req,res)); // added 16-08-22
router.route('/forms/save').post( async (req,res)=> forms_controller.save_all(req,res)); // added 16-06-22

//----------------------------
router.route('/values-previous')
.get( (req,res)=>value_prev_controller.select(req,res) )
.post( (req,res)=>value_prev_controller.create(req,res) );
router.route('/values-previous/:id')
.get( (req,res)=>value_prev_controller.findOne(req,res) )
.put( (req,res)=>value_prev_controller.update(req,res) )
.delete( (req,res)=>value_prev_controller.delete(req,res) );

//----------------------------
router.route('/values-1day-month')
.get( (req,res)=>value_1_d_month_controller.select(req,res) )
.post( (req,res)=>value_1_d_month_controller.create(req,res) );
router.route('/values-1day-month/:id')
.get( (req,res)=>value_1_d_month_controller.findOne(req,res) )
.put( (req,res)=>value_1_d_month_controller.update(req,res) )
.delete( (req,res)=>value_1_d_month_controller.delete(req,res) );


module.exports =  router 