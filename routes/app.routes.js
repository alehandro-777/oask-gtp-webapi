const auth = require('../controllers/auth.controller');

const docscontroll = require('../controllers/docs.controller');
const templatescontroll = require('../controllers/templates.controller');
const xmlcontroller = require('../controllers/xml.collection.controller');


const genericcontroller = require('../controllers/generic.controller');
const viewcontroller = require('../controllers/view.controller');

const mgsmodel = require('../mongoose.model');


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
  

    let correctorcontroller = genericcontroller.create(mgsmodel.createCorrectorModel(mongoose));    

    app.post('/corrector', correctorcontroller.create);
    app.get('/corrector', correctorcontroller.select);
    app.get('/corrector/:id', correctorcontroller.findOne);

    let daydatacontroller = genericcontroller.create(mgsmodel.createDayHlibModel(mongoose)); 
    app.post('/daydata', daydatacontroller.create);

    let flowlinecontroller = genericcontroller.create(mgsmodel.createFlowLineModel(mongoose)); 
    app.post('/flowline', flowlinecontroller.create);
    app.get('/flowline', flowlinecontroller.select);
    app.get('/flowline/:id', flowlinecontroller.findOne);

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
   let form = genericcontroller.create(mgsmodel.createFormModel(mongoose));    
   app.post('/form', form.create);
   app.get('/form', form.select);
   app.get('/form/:id', form.findOne);

   app.put('/form', form.update);
   app.delete('/form', form.delete);
   app.put('/form/:id', form.update);
   app.delete('/form/:id', form.delete);

       //------------------------------------------------------------------------
       let menu = genericcontroller.create(mgsmodel.createUserMenu(mongoose));    
       app.post('/menu', menu.create);
       app.get('/menu', menu.select);
       app.get('/menu/:id', menu.findOne);
    
       app.put('/menu', menu.update);
       app.delete('/menu', menu.delete);
       app.put('/menu/:id', menu.update);
       app.delete('/menu/:id', menu.delete);

}