var passport = require('passport');

var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

module.exports = function (app, config) {

    var files = require('../controllers/files')(config);
    var filestops = require('../controllers/filestops')(config);
    var users = require ('../controllers/users')(config);

    var path = config.path || '';

    app.get(path + '/filestop/:cid', filestops.get);
    app.get(path + '/filestop/:cid/files/:fileCid', files.download);
    app.delete(path + '/filestop/:cid/files/:fileCid', files.delete);
    app.get(path + '/filestop/:cid/files', filestops.getFiles);
    app.post(path + '/filestop/:cid/files', files.downloadAll);
    app.post(path + '/filestop/:cid/upload', files.upload);

    app.post(path + '/filestop', filestops.create);
    app.put(path + '/filestop/:cid', filestops.update);
    app.delete (path + '/filestop/:cid', filestops.delete);

    // user routes
    app.get('/users', auth, users.list);
    // route to check whether the user is logged in
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    })
    // route to log in
    app.post('/login', passport.authenticate('local'), function (req, res) {
        res.send(req.user);
    })
    // route to log out
    app.post('/logout', function(req, res) {
        req.logOut();
        res.send(200);
    })

    app.get(path + '/webcron', filestops.deleteExpired);
};
