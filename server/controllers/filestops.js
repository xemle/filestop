var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    Error = require ("errno-codes"),
    Filestop = mongoose.model('Filestop'),
    deleteExpired;

deleteExpired = function(config) {
    var now = new Date();
    Filestop.find({expires: { $lt: now }, keep: false}, function (err, result) {
        if (result) {
            result.forEach (function (filestop) {
                var expires = filestop.expires;
                if (expires.getTime() < now.getTime()) {
                    console.log("Delete expired filestop " + filestop.cid);
                    filestop.deleteAllFileModels();
                    filestop.deleteFolder(config, function() {});
                    filestop.remove();
                }
            });
        }
    });
};

module.exports = function (config) {
    var exports = {};

    exports.create = function(req, res) {
        var filestop = new Filestop(req.body);

        filestop.createClientId(config);
        filestop.url = config.baseURL + "/#/filestop/" + filestop.cid;
        if (req.isAuthenticated()) {
            filestop.userId = req.user.id;
        }

        filestop.save(function (err) {
            if (err) {
                res.send(400, {error: err});
            } else {
                res.send({success: 'OK', cid: filestop.cid});
            }
        });
        deleteExpired(config);
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
               if (req.body.name) {
                   filestop.name = req.body.name;
               }
               if (req.body.description) {
                   filestop.description = req.body.description;
               }
               if (req.body.expires) {
                   filestop.expires = new Date(req.body.expires);
               }
               if ('keep' in req.body) {
                   filestop.keep = req.body.keep;
               }
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
    exports.findAllByUser = function(req, res) {
        var userId = req.user.id;
        Filestop.find({userId: userId}).exec(function (err, result) {
            if (err) {
                return res.send(404)
            }
            res.send(result);
        });
    }
    return exports;
};