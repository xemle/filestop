var express = require('express'),
    passport = require('passport');

module.exports = function (app, config) {
    app.configure(function() {
        app.set('title', 'filestop');
        app.set('version', '0.1');

        app.use(express.bodyParser());

        var path = config.path || '';
        if (path) {
            app.use(function(req, res, next) {
               if (req.path == path) {
                   res.redirect(path + '/');
               } else {
                   next();
               }
            });
            app.use(path, express.static(__dirname + '/../../app'));
        } else {
            app.use(express.static(__dirname + '/../../app'));
        }

        // passportjs
        app.use (express.cookieParser());
        app.use(express.session({ secret: config.salt}));
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(express.logger());
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        if (config.behindProxy) {
            app.enable('trust proxy');
        }
    });
};

