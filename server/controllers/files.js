var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

module.exports = function (config) {
    var exports = {};
    exports.create = function (req, res) {
        var file = new File(req.body);
        file.save(function (err) {
            if (err) {
                res.send({success: false, errors: err});
            } else {
                res.send({success: 'OK', id: file._id});
            }
        });
    };
    exports.update = function (req, res, next) {
        var id = req.params.id;

        req.body.updated = new Date;

        File.findByIdAndUpdate(id, {$set: req.body}, function (err, file) {
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
    exports.delete = function (req, res, next) {
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
    exports.get = function (req, res) {
        var id = req.params.id;
        File.findOne({_id: id}, function (err, result) {
            if (!result) {
                console.log("File with " + id + " not found");
                res.send(null);
            }
            res.send(result);
        });
    };
    exports.findAll = function (req, res) {
        File.find().exec(function (err, result) {
            res.send(result);
        });
    };
    exports.upload = function (req, res) {
        var id = req.body.filestopId;
        var chunk = req.body.chunk || 0;
        var chunks = req.body.chunks || 1;
        console.log("upload called on id " + id + " chunk " + chunk + "/" + chunks);

        fs.readFile(req.files.file.path, function (err, data) {
            var fileDir = __dirname + "/uploads/" + id + "/";
            var filePath = fileDir + req.body.name;
            var filePathPart = filePath + ".part";
            console.log("writing upload to " + filePath);
            mkdirp(fileDir, 0755, function (err) {
                if (err) {
                    console.log("Error creating directory " + fileDir + ": ", err);
                    res.send({success: false, errors: "Upload error"});
                    return;
                }
                fs.appendFile(filePathPart, data, function (err) {
                    if (err) {
                        console.log("Error saving chunk " + chunk + "/" + chunks + ": ", err);
                        res.send({success: false, errors: "Upload error"});
                        return;
                    }

                    if (chunk == chunks - 1) {
                        fs.rename(filePathPart, filePath, function (err) {
                            fs.stat(filePath, function (err, stats) {
                                var filesize = stats.size;
                                var file = new File({filestop: id, name: req.body.name, size: filesize});
                                file.save(function (err) {
                                    if (!err) {
                                        res.send({success: "OK", file: file});
                                        return;
                                    }
                                });
                            });
                        });
                    } else {
                        res.send({success: "OK"});
                    }
                });
            });


        });
    };
    return exports;
}
