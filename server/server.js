var express = require('express'),
    passport = require('passport'),
    fs = require('fs');

var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose');

mongoose.connect(config.db);

var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/' + file)(config);
});

var app = express();
require('./config/express')(app, config);
require('./config/routes')(app, config);
require('./config/passport')();

app.listen(config.port, function(){
    console.log("Filestop server listening on port %d in %s mode", this.address().port, env);
});