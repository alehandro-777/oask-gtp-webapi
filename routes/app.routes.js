const auth = require('../controllers/auth.controller');
const genericcontroller = require('../controllers/generic.controller');
const mongoose_model = require('../mongoose.model');
const aggregate_model = require('../aggregate.mongoose.model');

const grepository = require('../repo/generic.repo');
const report = require('../controllers/view.controller');



module.exports = (app, mongoose) => {
    //auth
    app.post('/auth/login', auth.login);
    app.post('/auth/register', auth.register);
    
  
    let corrector_model = mongoose_model.createCorrectorModel(mongoose);
    CreateEndPoints(app, corrector_model, "corrector");

    let daydata_model = mongoose_model.createDayHlibModel(mongoose);
    CreateEndPoints(app, daydata_model, "daydata");


    let dbo_model = mongoose_model.createDBObjectModel(mongoose);   
    CreateEndPoints(app, dbo_model, "dbo");

    let dbodata_model = mongoose_model.createDBObjectValueModel(mongoose);
    CreateEndPoints(app, dbodata_model, "dbodata");

    let hourdata_model = mongoose_model.createHourHlibModel(mongoose);
    CreateEndPoints(app, hourdata_model, "hourdata");

    let instdata_model = mongoose_model.createInstHlibModel(mongoose);
    CreateEndPoints(app, instdata_model, "instdata");

    let statdata_model = mongoose_model.createStatHlibModel(mongoose);
    CreateEndPoints(app, statdata_model, "statdata");

    let rtdata_model = mongoose_model.createRtValueModel(mongoose);
    CreateEndPoints(app, rtdata_model, "rtdata");
    
    let rtsys_model = mongoose_model.createRtSystemModel(mongoose);
    CreateEndPoints(app, rtsys_model, "rtsystem");

    //------------------------------------------------------------------------
    let guitable_model = mongoose_model.createGuiTableModel(mongoose);
    CreateEndPoints(app, guitable_model, "guitable");
    //------------------------------------------------------------------------
   
   let form_model = mongoose_model.createFormModel(mongoose);
   CreateEndPoints(app, form_model, "form");

   //------------------------------------------------------------------------
   let menu_model = mongoose_model.createUserMenu(mongoose);    
   CreateEndPoints(app, menu_model, "menu");

//----------------------------------------------------------------------------------
    let formdata_model = mongoose_model.createFormDataModel(mongoose);
    CreateEndPoints(app, formdata_model, "formdata");

    let aggrmgs_model = aggregate_model.createRegimPSGModel(mongoose);
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