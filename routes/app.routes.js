const docscontroll = require('../controllers/docs.controller');
const templatescontroll = require('../controllers/templates.controller');
const collcontroller = require('../controllers/collection.controller');

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

    
}