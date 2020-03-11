const auth = require('../controllers/auth.controller');

const docscontroll = require('../controllers/docs.controller');
const templatescontroll = require('../controllers/templates.controller');
const xmlcontroller = require('../controllers/xml.collection.controller');

const genericcontroller = require('../controllers/generic.controller');

const mgsmodel = require('../mongoose.model');

const grepository = require('../repo/generic.repo');

const report = require('../controllers/view.controller');

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


    let daydata_model = mgsmodel.createDayHlibModel(mongoose);
    let daydata_repository = grepository.create(daydata_model);   
    let daydata_controller = genericcontroller.create(daydata_model, daydata_repository); 

    app.post('/daydata', daydata_controller.create);
    app.get('/daydata/:id', daydata_controller.findOne);
    app.get('/daydata', daydata_controller.select);


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

    let hourdata_model = mgsmodel.createHourHlibModel(mongoose);
    let hourdata_repository = grepository.create(hourdata_model);   
    let hourdata_controller = genericcontroller.create(hourdata_model, hourdata_repository); 
    app.post('/hourdata', hourdata_controller.create);


    let instdata_model = mgsmodel.createInstHlibModel(mongoose);
    let instdata_repository = grepository.create(instdata_model);   
    let instdata_controller = genericcontroller.create(instdata_model, instdata_repository); 

    app.post('/instdata', instdata_controller.create);
    app.get('/instdata/:id', instdata_controller.findOne);
    app.get('/instdata', instdata_controller.select);

    let statdata_model = mgsmodel.createStatHlibModel(mongoose);
    let statdata_repository = grepository.create(statdata_model);   
    let statdata_controller = genericcontroller.create(statdata_model, statdata_repository); 

    app.post('/statdata', statdata_controller.create);
    app.get('/statdata/:id', statdata_controller.findOne);
    app.get('/statdata', statdata_controller.select);


    let rtdata_model = mgsmodel.createRtValueModel(mongoose);
    let rtdata_repository = grepository.create(rtdata_model);   
    let rtdata_controller = genericcontroller.create(rtdata_model, rtdata_repository); 

    app.post('/rtdata', rtdata_controller.create);
    app.get('/rtdata/:id', rtdata_controller.findOne);
    app.get('/rtdata', rtdata_controller.select);
    

    let rtsys_model = mgsmodel.createRtSystemModel(mongoose);
    let rtsys_repository = grepository.create(rtsys_model);   
    let rtsys_controller = genericcontroller.create(rtsys_model, rtsys_repository); 

    app.post('/rtsystem', rtsys_controller.create);
    app.post('/rtsystem/:id', rtsys_controller.findOne);
    app.post('/rtsystem', rtsys_controller.select);


    //------------------------------------------------------------------------
    let guitable_model = mgsmodel.createGuiTableModel(mongoose);
    let guitables_repository = grepository.create(guitable_model);   
    let guitable_controller = genericcontroller.create(guitable_model, guitables_repository); 
 
    app.post('/guitable', guitable_controller.create);
    app.get('/guitable', guitable_controller.select);
    app.get('/guitable/:id', guitable_controller.findOne);

    app.put('/guitable', guitable_controller.update);
    app.delete('/guitable', guitable_controller.delete);
    app.put('/guitable/:id', guitable_controller.update);
    app.delete('/guitable/:id', guitable_controller.delete);

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

    app.get('/report/:id', report.findOne);


}