const docscontroll = require('../controllers/database.controller');

module.exports = (app) => {
    
    app.get('/docs', docscontroll.select);
    //app.get('/mpoints/:id', mpoint.findOne);
    //app.post('/mpoints', authFunc, mpoint.create);
    //app.delete('/mpoints/:id', mpoint.delete);
    //app.put('/mpoints/:id', mpoint.update);
    //app.patch('/mpoints/:id', mpoint.partialupdate);

}