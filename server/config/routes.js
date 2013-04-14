module.exports = function (app, config) {

    var files = require('../controllers/files')(config);
    app.get('/files/:id', files.get);
    app.get('/files', files.findAll);
    app.post('/files', files.create);
    app.put('/files/:id', files.update);
    app.delete ('/files/:id', files.delete);

    var filestops = require('../controllers/filestops');
    app.get('/filestops/:id/files', filestops.getFiles);
    app.post('/filestops/:id/upload', files.upload);
    app.get('/filestops/:id', filestops.get);
    app.get('/filestops', filestops.findAll);
    app.post('/filestops', filestops.create);
    app.put('/filestops/:id', filestops.update);
    app.delete ('/filestops/:id', filestops.delete);
};
