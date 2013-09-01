var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
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

var User = mongoose.model('User');

// \todo: remove dummy user
// create dummy user
var dummy_user = new User ({emailAddress: "email4@bla.com", passwordHash: "116d87ea3f38a30a773fd41ce839e5d0228c816b78101b6f303d3ee486b0c0e8", uid: 45});
dummy_user.save();

passport.serializeUser(function(user, done) {
    console.log ("Serializing " + typeof(user) + " uid = " + user.uid);
    done (null, user.uid);
})

passport.deserializeUser(function(uid, done) {
    User.findOne(parseInt(uid), function (err, user) {
        console.log ("Deserialized " + typeof(user) + " uid = " + user.uid);
        done(err, user);
    })
})

passport.use(new LocalStrategy(
    function(username, password, done) {

        User.findOne({emailAddress: username}, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'User not found.'});
            }
            if (!user.validatePassword(password)) {
                return done (null, false, { message: 'Wrong password.'})
            }

            return done(null, user);
        })
    }
))

app.listen(config.port, function(){
    console.log("Filestop server listening on port %d in %s mode", this.address().port, env);
});