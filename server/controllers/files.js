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
exports.update = function(req, res, next) {
    var id = req.params.id;

    req.body.updated = new Date;

    File.findByIdAndUpdate (id, {$set: req.body}, function (err, file) {
        if (err) {
            console.log("Error updating File with id " + id + ": " + err);
            res.send({success: false, errors: err});
            return;
        }

        if (file)
            res.send({success: 'OK', id: file._id});
        else {
            console.log("Error updating File with id " + id + ": not found");
            res.send({success: false, errors: "File not found"});
        }
    });
};
exports.delete = function(req, res, next) {
    var id = req.params.id;

    File.findByIdAndRemove(id, function (err, file) {
        if (err) {
            console.log("Error deleting File with id " + id + ": " + err);
            res.send({success: false, errors: err});
            return;
        }

        if (file)
            res.send({success: 'OK', id: id});
        else {
            console.log("Error deleting File with id " + id + ": not found");
            res.send({success: false, errors: "File not found"});
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