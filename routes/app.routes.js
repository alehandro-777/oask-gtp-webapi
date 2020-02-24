const docscontroll = require('../controllers/docs.controller');
const templatescontroll = require('../controllers/templates.controller');
const collcontroller = require('../controllers/collection.controller');
const jsontable = require('../controllers/coll-json.controller');

const correctorcontroller = require('../controllers/corrector.controller');
const daydatacontroller = require('../controllers/daydata.controller');
const flowlinecontroller = require('../controllers/flowline.controller');
const hourdatacontroller = require('../controllers/hourdata.controller');
const instdatacontroller = require('../controllers/instdata.controller');
const statdatacontroller = require('../controllers/statdata.controller');

const rtdatacontroller = require('../controllers/rtdata.controller');
const rtsystemcontroller = require('../controllers/rtsystem.controller');

module.exports = (app) => {
    
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

    app.post('/tablejs/:id', jsontable.create);
    app.get('/tablejs/:id', jsontable.select);
    app.delete('/tablejs/:id', jsontable.delete);
    app.put('/tablejs/:id', jsontable.update);

    
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

}