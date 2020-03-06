const auth = require('../controllers/auth.controller');

const docscontroll = require('../controllers/docs.controller');
const templatescontroll = require('../controllers/templates.controller');
const xmlcontroller = require('../controllers/xml.collection.controller');


const genericcontroller = require('../controllers/generic.controller');
const viewcontroller = require('../controllers/view.controller');

const mgsmodel = require('../mongoose.model');

const grepository = require('../repo/generic.repo');


module.exports = (app, mongoose) => {
    //auth
    app.post('/auth/login', auth.login);
    app.post('/auth/register', auth.register);
    
    app.post('/docs', docscontroll.create);
    app.get('/docs', docscontroll.select);
    app.get('/docs/:id', docscontroll.findOne);
    app.put('/docs', docscontroll.update);  

    app.post('/templates', templatescontroll.create);
    app.get('/templates/:id', templatescontroll.findOne);
 
    app.post('/collection/:id', xmlcontroller.create);
    app.get('/collection/:id', xmlcontroller.select);
    app.delete('/collection/:id', xmlcontroller.delete);
    app.put('/collection/:id', xmlcontroller.update);
  
    let corrector_model = mgsmodel.createCorrectorModel(mongoose);
    let corrector_repository = grepository.create(corrector_model);
    let corrector_controller = genericcontroller.create(corrector_model, corrector_repository);    

    app.post('/corrector', corrector_controller.create);
    app.get('/corrector', corrector_controller.select);
    app.get('/corrector/:id', corrector_controller.findOne);


    let daydatacontroller = genericcontroller.create(mgsmodel.createDayHlibModel(mongoose)); 
    app.post('/daydata', daydatacontroller.create);


    let dbo_model = mgsmodel.createDBObjectModel(mongoose);
    let dbo_repository = grepository.create(dbo_model);   
    let dbo_controller = genericcontroller.create(dbo_model, dbo_repository); 

    app.dbo_repo = dbo_repository;

    app.post('/dbo', dbo_controller.create);
    app.get('/dbo', dbo_controller.select);
    app.get('/dbo/:id', dbo_controller.findOne);


    let dbodata_model = mgsmodel.createDBObjectValueModel(mongoose);
    let dbodata_repository = grepository.create(dbodata_model);   
    let dbodata_controller = genericcontroller.create(dbodata_model, dbodata_repository); 
    app.post('/dbodata', dbodata_controller.create);

    app.dbodata_repo = dbodata_repository;


    let hourdatacontroller = genericcontroller.create(mgsmodel.createHourHlibModel(mongoose)); 
    app.post('/hourdata', hourdatacontroller.create);

    let instdatacontroller = genericcontroller.create(mgsmodel.createInstHlibModel(mongoose));
    app.post('/instdata', instdatacontroller.create);
    app.get('/instdata/:id', instdatacontroller.select);

    let statdatacontroller = genericcontroller.create(mgsmodel.createStatHlibModel(mongoose));
    app.post('/statdata', statdatacontroller.create);

    let rtdatacontroller = genericcontroller.create(mgsmodel.createRtValueModel(mongoose));
    app.post('/rtdata', rtdatacontroller.create);
    
    let rtsystemcontroller = genericcontroller.create(mgsmodel.createRtSystemModel(mongoose));
    app.post('/rtsystem', rtsystemcontroller.create);

    app.get('/view/:id', viewcontroller.findOne);


    //------------------------------------------------------------------------
    let guitable = genericcontroller.create(mgsmodel.createGuiTableModel(mongoose));    
    app.post('/guitable', guitable.create);
    app.get('/guitable', guitable.select);
    app.get('/guitable/:id', guitable.findOne);

    app.put('/guitable', guitable.update);
    app.delete('/guitable', guitable.delete);
    app.put('/guitable/:id', guitable.update);
    app.delete('/guitable/:id', guitable.delete);

    //------------------------------------------------------------------------
   
   let form_model = mgsmodel.createFormModel(mongoose);
   let form_repository = grepository.create(form_model);   
   let form_controller = genericcontroller.create(form_model, form_repository);
   
   app.post('/form', form_controller.create);
   app.get('/form', form_controller.select);
   app.get('/form/:id', form_controller.findOne);

   app.put('/form', form_controller.update);
   app.delete('/form', form_controller.delete);
   app.put('/form/:id', form_controller.update);
   app.delete('/form/:id', form_controller.delete);

       //------------------------------------------------------------------------
       let menu = genericcontroller.create(mgsmodel.createUserMenu(mongoose));    
       app.post('/menu', menu.create);
       app.get('/menu', menu.select);
       app.get('/menu/:id', menu.findOne);
    
       app.put('/menu', menu.update);
       app.delete('/menu', menu.delete);
       app.put('/menu/:id', menu.update);
       app.delete('/menu/:id', menu.delete);

//----------------------------------------------------------------------------------
    let formdata_model = mgsmodel.createFormDataModel(mongoose);
    let formdata_repository = grepository.create(formdata_model);   
    let formdata_controller = genericcontroller.create(formdata_model, formdata_repository);
    
    app.post('/formdata', formdata_controller.create);
    app.get('/formdata', formdata_controller.select);
    app.get('/formdata/:id', formdata_controller.findOne);

}