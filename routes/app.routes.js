const auth = require('../controllers/auth.controller');

const docscontroll = require('../controllers/docs.controller');
const templatescontroll = require('../controllers/templates.controller');
const collcontroller = require('../controllers/collection.controller');

const correctorcontroller = require('../controllers/corrector.controller');
const daydatacontroller = require('../controllers/daydata.controller');
const flowlinecontroller = require('../controllers/flowline.controller');
const hourdatacontroller = require('../controllers/hourdata.controller');
const instdatacontroller = require('../controllers/instdata.controller');
const statdatacontroller = require('../controllers/statdata.controller');

const rtdatacontroller = require('../controllers/rtdata.controller');
const rtsystemcontroller = require('../controllers/rtsystem.controller');
const regimparamcontroller = require('../controllers/regimparam.controller');

const genericcontroller = require('../controllers/generic.controller');
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
 
    app.post('/collection/:id', collcontroller.create);
    app.get('/collection/:id', collcontroller.select);
    app.delete('/collection/:id', collcontroller.delete);
    app.put('/collection/:id', collcontroller.update);
  
    app.post('/corrector', correctorcontroller.create);
    app.get('/corrector', correctorcontroller.select);
    app.get('/corrector/:id', correctorcontroller.findOne);

    app.post('/daydata', daydatacontroller.create);

    app.post('/flowline', flowlinecontroller.create);
    app.get('/flowline', flowlinecontroller.select);
    app.get('/flowline/:id', flowlinecontroller.findOne);

    app.post('/hourdata', hourdatacontroller.create);

    app.post('/instdata', instdatacontroller.create);
    app.get('/instdata/:id', instdatacontroller.select);

    app.post('/statdata', statdatacontroller.create);

    app.post('/rtdata', rtdatacontroller.create);
    
    app.post('/rtsystem', rtsystemcontroller.create);

    app.post('/regimparam', regimparamcontroller.create);
    app.get('/regimparam', regimparamcontroller.select);
    app.get('/regimparam/:id', regimparamcontroller.findOne);


    //------------------------------------------------------------------------
    let contr = genericcontroller.create(mgsmodel.createTestModel(mongoose));    
    app.post('/test', contr.create);
    app.get('/test', contr.select);
    app.get('/test/:id', contr.findOne);

    app.put('/test', contr.update);
    app.delete('/test', contr.delete);
    app.put('/test/:id', contr.update);
    app.delete('/test/:id', contr.delete);

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


}