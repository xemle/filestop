var express = require('express');

module.exports = function (app, config) {
    app.configure(function() {
        app.set('title', 'filestop');
        app.set('version', '0.1');

        app.use(express.bodyParser());

        app.use(express.static(__dirname + '/../../app'));
        app.use(express.logger());
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });
};

