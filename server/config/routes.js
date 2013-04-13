module.exports = function (app) {

    var files = require('../controllers/files');
    app.get('/files/:id', files.get);
    app.get('/files', files.findAll);
    app.post('/files', files.create);

    var filestops = require('../controllers/filestops');
    app.get('/filestops/:id', filestops.get);
    app.get('/filestops/files/:id', filestops.getFiles);
    app.get('/filestops', filestops.findAll);
    app.post('/filestops', filestops.create);
    app.put('/filestops/:id', filestops.update);
    app.delete ('/filestops/:id', filestops.delete);
};