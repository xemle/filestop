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
    var path = config.path || '';
    app.get(path + '/filestop/:cid', filestops.get);
    app.get(path + '/filestop/:cid/files/:fileCid', files.download);
    app.delete(path + '/filestop/:cid/files/:fileCid', files.delete);
    app.get(path + '/filestop/:cid/files', filestops.getFiles);
    app.post(path + '/filestop/:cid/files', files.downloadAll);
    app.post(path + '/filestop/:cid/upload', files.upload);
    app.get(path + '/filestop', filestops.findAll);
    app.post(path + '/filestop', filestops.create);
    app.put(path + '/filestop/:cid', filestops.update);
    app.delete (path + '/filestop/:cid', filestops.delete);
};
