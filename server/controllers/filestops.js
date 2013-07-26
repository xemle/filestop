var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    Error = require ("errno-codes"),
    Filestop = mongoose.model('Filestop');

module.exports = function (config) {
    var exports = {};

    exports.create = function(req, res) {
        var filestop = new Filestop(req.body);

        filestop.createClientId(config);
        filestop.url = config.baseURL + "/#/filestop/" + filestop.cid;

        filestop.save(function (err) {
            if (err) {
                res.send(400, {error: err});
            } else {
                res.send({success: 'OK', cid: filestop.cid});
            }
        });
    };
    exports.update = function(req, res, next) {
        var cid = req.params.cid;

        // findAndUpdate does not call custom validators right now
        // see this bug report: https://github.com/LearnBoost/mongoose/issues/860
        // this is so sad... Use workaround with findOne with save
        Filestop.findOne({cid: cid}, function(err, filestop) {
           if (err) {
               res.send(404);
           } else {
               filestop.name = req.body.name;
               filestop.description = req.body.description;
               filestop.updated = new Date();
               filestop.save(function(err) {
                  if (err) {
                      res.send(400, err);
                  } else {
                      console.log("Updated Filestop with cid " + cid);
                      res.send(200);
                  }
               });
           }
        });
    };
    exports.delete = function(req, res, next) {
        var cid = req.params.cid;

        Filestop.findOne({cid:cid}, function (err, filestop) {
            if (err) {
                console.log("Error deleting Filestop with cid " + cid + ": " + err);
                res.send({success: false, errors: err});
                return;
            }
            if (filestop) {
                filestop.deleteAllFileModels();
                filestop.deleteFolder(config, function (err) {
                    // ENOENT is "File does not exist"
                    if (err && err.errno != Error.ENOENT.errno) {
                        res.send({success: 'false', error: err});
                        return;
                    }
                    filestop.remove();
                    res.send({success: 'OK', cid: cid});
                    return;
                });
            } else {
                console.log("Error deleting Filestop with cid " + cid + ": not found");
                res.send({success: false, errors: "Filestop not found"});
            }
        });
    };
    exports.get = function(req, res, next) {
        var cid = req.params.cid;
        Filestop.findOne({cid: cid}, function (err, result) {
            if (!result) {
                console.log("Filestop with cid " + cid + " not found");
                res.send(404);
                return
            }
            res.send(result);
        });
    };

    exports.getFiles = function(req, res, next) {
        var cid = req.params.cid;
        Filestop.findOne({cid: cid}, function (err, filestop) {
            if (!filestop) {
                console.log("Filestop with cid " + cid + " not found");
                res.send(404);
                return;
            } else {
                File.find({filestopCId: cid}, function (err, result) {
                    res.send(result);
                });
            }
        });
    };
    exports.findAll = function(req, res) {
        Filestop.find().exec(function (err, result) {
            res.send(result);
        });
    };
    exports.deleteExpired = function(req, res) {
        var now = new Date();
        Filestop.find({expires: { $lt: now }}, function (err, result) {
            if (result) {
                result.forEach (function (filestop) {
                    var expires = filestop.expires;
                    if (expires.getTime() == filestop.created.getTime()) {
                        expires = new Date(filestop.created.getTime() + config.defaultExpireOffset * 1000);
                    }
                    if (expires.getTime() < now.getTime()) {
                        filestop.deleteAllFileModels();
                        filestop.deleteFolder(config);
                        filestop.remove();
                    }
                });
            }
        });
        res.send(200);
    };
    return exports;
};