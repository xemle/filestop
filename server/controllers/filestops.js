var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    Filestop = mongoose.model('Filestop');
    ;

exports.create = function(req, res) {
    var filestop = new Filestop(req.body);
    filestop.save(function (err) {
        if (err) {
            res.send({success: false, errors: err});
        } else {
            res.send({success: 'OK', id: filestop._id});
        }
    });
};
exports.update = function(req, res, next) {
    var id = req.params.id;

    req.body.updated = new Date;

    Filestop.findByIdAndUpdate (id, {$set: req.body}, function (err, filestop) {
        if (err) {
            console.log("Error updating Filestop with id " + id + ": " + err);
            res.send({success: false, errors: err});
            return;
        }

        if (filestop)
            res.send({success: 'OK', id: filestop._id});
        else {
            console.log("Error updating Filestop with id " + id + ": not found");
            res.send({success: false, errors: "Filestop not found"});
        }
    });
};
exports.delete = function(req, res, next) {
    var id = req.params.id;

    Filestop.findByIdAndRemove(id, function (err, filestop) {
        if (err) {
            console.log("Error deleting Filestop with id " + id + ": " + err);
            res.send({success: false, errors: err});
            return;
        }

        if (filestop)
            res.send({success: 'OK', id: id});
        else {
            console.log("Error deleting Filestop with id " + id + ": not found");
            res.send({success: false, errors: "Filestop not found"});
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
    File.find({filestop: id}, function (err, result) {
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