const docscontroll = require('../controllers/docs.controller');
const templatescontroll = require('../controllers/templates.controller');
const testcontroller = require('../controllers/test.controller');
const collcontroller = require('../controllers/collection.controller');

module.exports = (app) => {
    
    app.post('/docs', docscontroll.create);
    app.get('/docs', docscontroll.select);
    app.get('/docs/:id', docscontroll.findOne);
    app.put('/docs', docscontroll.update);  

    app.post('/templates', templatescontroll.create);
    app.get('/templates/:id', templatescontroll.findOne);

    //app.delete('/mpoints/:id', mpoint.delete);
    //app.put('/mpoints/:id', mpoint.update);
    //app.patch('/mpoints/:id', mpoint.partialupdate);
    
    app.post('/test/:id', testcontroller.create);
    app.get('/test', testcontroller.select);
    app.get('/test/:id', testcontroller.findOne);
    app.put('/test', testcontroller.update);

    app.get('/collection/:id', collcontroller.findOne);

}