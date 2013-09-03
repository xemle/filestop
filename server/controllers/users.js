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
        var user = new User({email: req.body.email});
        user.passwordHash = user.createPasswordHash(req.body.password);
        user.save(function(err) {
            if (err) {
                res.send(505);
            } else {
                res.send(200);
            }
        })
    };
    return exports;
}
