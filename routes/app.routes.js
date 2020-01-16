const docscontroll = require('../controllers/database.controller');

module.exports = (app) => {
    
    app.post('/docs', docscontroll.create);
    app.get('/docs', docscontroll.select);
    app.get('/docs/:id', docscontroll.findOne);
    
    //app.delete('/mpoints/:id', mpoint.delete);
    //app.put('/mpoints/:id', mpoint.update);
    //app.patch('/mpoints/:id', mpoint.partialupdate);

}