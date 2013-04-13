var mongoose = require('mongoose'),
    File = mongoose.model('File');

exports.create = function(req, res) {
    var file = new File(req.body);
    file.save(function (err) {
        if (err) {
            res.send({success: false, errors: err});
        } else {
            res.send({success: 'OK', id: file._id});
        }
    });
};
exports.findAll = function(req, res) {
    File.find().exec(function (err, result) {
        res.send(result);
    });
};