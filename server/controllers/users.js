var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (config) {
    var exports = {};

    /*
    exports.create = function (req, res) {
        var file = new File(req.body);

        file.createClientId(config);

        file.save(function (err) {
            if (err) {
                res.send({success: false, errors: err});
            } else {
                res.send({success: 'OK', cid: file.cid});
            }
        });
    };
    */
    exports.signup = function(req, res) {
        User.findOne({email: req.body.email}, function (err, result) {
            if (err) {
                return;
            }
            if (result) {
                console.log("Cannot signup user '" + req.body.email + "': email already registered!");
                res.send(409, "Error: email already registered!");
            } else {
                var user = new User({email: req.body.email});
                user.passwordHash = user.createPasswordHash(req.body.password);
                user.save(function(err) {
                    if (err) {
                        res.send(505);
                    } else {
                        res.send(200);
                    }
                })
            }
        });
    };
    return exports;
}
