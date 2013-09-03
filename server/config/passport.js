var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function() {
    passport.serializeUser(function(user, done) {
        done (null, user.email);
    });

    passport.deserializeUser(function(email, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err, false, { message: 'User with email ' + email + ' not found'});
            }
            done(err, {email: user.email});
        })
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({email: username}, function (err, user) {
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
    ));
};