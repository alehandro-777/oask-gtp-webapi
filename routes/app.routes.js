const auth = require('../controllers/auth.controller');
const genericcontroller = require('../controllers/generic.controller');
const mgsmodel = require('../mongoose.model');
const aggrmgsmodel = require('../aggregate.mongoose.model');

const grepository = require('../repo/generic.repo');
const report = require('../controllers/view.controller');



module.exports = (app, mongoose) => {
    //auth
    app.post('/auth/login', auth.login);
    app.post('/auth/register', auth.register);
    
  
    let corrector_model = mgsmodel.createCorrectorModel(mongoose);
    CreateEndPoints(app, corrector_model, "corrector");

    let daydata_model = mgsmodel.createDayHlibModel(mongoose);
    CreateEndPoints(app, daydata_model, "daydata");


    let dbo_model = mgsmodel.createDBObjectModel(mongoose);   
    CreateEndPoints(app, dbo_model, "dbo");

    let dbodata_model = mgsmodel.createDBObjectValueModel(mongoose);
    CreateEndPoints(app, dbodata_model, "dbodata");

    let hourdata_model = mgsmodel.createHourHlibModel(mongoose);
    CreateEndPoints(app, hourdata_model, "hourdata");

    let instdata_model = mgsmodel.createInstHlibModel(mongoose);
    CreateEndPoints(app, instdata_model, "instdata");

    let statdata_model = mgsmodel.createStatHlibModel(mongoose);
    CreateEndPoints(app, statdata_model, "statdata");

    let rtdata_model = mgsmodel.createRtValueModel(mongoose);
    CreateEndPoints(app, rtdata_model, "rtdata");
    
    let rtsys_model = mgsmodel.createRtSystemModel(mongoose);
    CreateEndPoints(app, rtsys_model, "rtsystem");

    //------------------------------------------------------------------------
    let guitable_model = mgsmodel.createGuiTableModel(mongoose);
    CreateEndPoints(app, guitable_model, "guitable");
    //------------------------------------------------------------------------
   
   let form_model = mgsmodel.createFormModel(mongoose);
   CreateEndPoints(app, form_model, "form");

   //------------------------------------------------------------------------
   let menu_model = genericcontroller.create(mgsmodel.createUserMenu(mongoose));    
   CreateEndPoints(app, menu_model, "menu");

//----------------------------------------------------------------------------------
    let formdata_model = mgsmodel.createFormDataModel(mongoose);
    CreateEndPoints(app, formdata_model, "formdata");

    let aggrmgs_model = aggrmgsmodel.createRegimPSGModel(mongoose);
    CreateEndPoints(app, aggrmgs_model, "regim-mrin");


    app.get('/report/:id', report.findOne);

}












function CreateEndPoints(app, model, route_name)
{
    let repository = grepository.create(model);   
    let controller = genericcontroller.create(model, repository);
  
    app.post(`/${route_name}`, controller.create);
    app.get(`/${route_name}`, controller.select);
    app.get(`/${route_name}/:id`, controller.findOne);
 
    app.put(`/${route_name}`, controller.update);
    app.delete(`/${route_name}`, controller.delete);
    app.put(`/${route_name}/:id`, controller.update);
    app.delete(`/${route_name}/:id`, controller.delete);

}