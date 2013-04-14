module.exports = function (app, config) {

    var files = require('../controllers/files')(config);
    /*
    app.get('/files/:cid', files.get);
    app.get('/files', files.findAll);
    app.post('/files', files.create);
    app.put('/files/:cid', files.update);
    app.post('/files/upload', files.upload);
    */

    var filestops = require('../controllers/filestops')(config);
    app.get('/filestop/:cid', filestops.get);
    app.get('/filestop/:cid/files/:fileCid', files.download);
    app.delete('/filestop/:cid/files/:fileCid', files.delete);
    app.get('/filestop/:cid/files', filestops.getFiles);
    app.post('/filestop/:cid/upload', files.upload);
    app.get('/filestop', filestops.findAll);
    app.post('/filestop', filestops.create);
    app.put('/filestop/:cid', filestops.update);
    app.delete ('/filestop/:cid', filestops.delete);
};
