var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    Filestop = mongoose.model('Filestop');
    ;

exports.create = function(req, res) {
    var file = new Filestop(req.body);
    file.save(function (err) {
        if (err) {
            res.send({success: false, errors: err});
        } else {
            res.send({success: 'OK', id: file._id});
        }
    });
};
exports.get = function(req, res, next) {
    var id = req.params.id;
    Filestop.findOne({_id: id}, function (err, result) {
        if (!result) {
            console.log("Filestop with " + id + " not found");
            res.send(null);
        }
        res.send(result);
    });
};

exports.getFiles = function(req, res, next) {
    var id = req.params.id;
    File.findAll({filestop: id}, function (err, result) {
        if (!result) {
            console.log("No Files found for Filestop with " + id);
            res.send(null);
        }
        res.send(result);
    });
};
exports.findAll = function(req, res) {
    Filestop.find().exec(function (err, result) {
        res.send(result);
    });
};