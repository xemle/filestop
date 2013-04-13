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
exports.get = function(req, res) {
    var id = req.params.id;
    File.findOne({_id: id}, function (err, result) {
        if (!result) {
            console.log("File with " + id + " not found");
            res.send(null);
        }
        res.send(result);
    });
};
exports.findAll = function(req, res) {
    File.find().exec(function (err, result) {
        res.send(result);
    });
};