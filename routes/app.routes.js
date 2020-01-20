const docscontroll = require('../controllers/docs.controller');
const templatescontroll = require('../controllers/templates.controller');

module.exports = (app) => {
    
    app.post('/docs/:id', docscontroll.create);
    app.get('/docs', docscontroll.select);
    app.get('/docs/:id', docscontroll.findOne);
    app.put('/docs', docscontroll.update);  

    app.post('/templates', templatescontroll.create);
    app.get('/templates/:id', templatescontroll.findOne);

    //app.delete('/mpoints/:id', mpoint.delete);
    //app.put('/mpoints/:id', mpoint.update);
    //app.patch('/mpoints/:id', mpoint.partialupdate);

}