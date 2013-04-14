var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    mime = require('mime'),
    tinyzip = require('tinyzip');

module.exports = function (config) {
    var exports = {};
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
    exports.update = function (req, res, next) {
        var cid = req.params.cid;

        req.body.updated = new Date;

        File.findOneAndUpdate({cid: cid}, {$set: req.body}, function (err, file) {
            if (err) {
                console.log("Error updating File with cid " + cid + ": " + err);
                res.send({success: false, errors: err});
                return;
            }

            if (file)
                res.send({success: 'OK', cid: file.cid});
            else {
                console.log("Error updating File with cid " + cid + ": not found");
                res.send({success: false, errors: "File not found"});
            }
        });
    };
    exports.delete = function (req, res, next) {
        var filestop_cid = req.params.cid;
        var file_cid = req.params.fileCid;

        File.findOneAndRemove({cid: file_cid, filestopCId: filestop_cid}, function (err, file) {
            if (err) {
                console.log("Error deleting File with cid " + file_cid + ": " + err);
                res.send({success: false, errors: err});
                return;
            }

            if (file) {
                file.deleteFile(config);

                res.send({success: 'OK', cid: file.cid});
            } else {
                console.log("Error deleting File with cid " + file_cid + ": not found");
                res.send({success: false, errors: "File not found"});
            }


        });
    };
    exports.get = function (req, res) {
        var cid = req.params.cid;
        File.findOne({cid: cid}, function (err, result) {
            if (!result) {
                console.log("File with " + cid + " not found");
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
    exports.download = function (req, res) {
        var filestop_cid = req.params.cid;
        var file_cid = req.params.fileCid;
        File.findOne({cid: file_cid, filestopCId: filestop_cid}, function (err, result) {
            if (!result) {
                console.log("File with " + file_cid + " not found");
                res.send(null);
            } else {
                var file = config.uploadDir + "/" + filestop_cid + "/" + result.filename;
                var filename = result.filename;
                var mimetype = mime.lookup(file);

                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.setHeader('Content-type', mimetype);

                var filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        });

    };
    exports.downloadAll = function (req, res) {
        var filestop_cid = req.params.cid;
        var file_cids = req.body.fileCids.split(',');
        File.find({cid: {$in: file_cids}, filestopCId: filestop_cid}, function (err, result) {
            if (!result) {
                console.log("Files with " + file_cids.join(', ') + " not found");
                res.send(null);
            } else {
                var zipFilename = "filestop-" + filestop_cid + ".zip";
                res.setHeader('Content-disposition', 'attachment; filename=' + zipFilename);
                res.setHeader('Content-type', 'application/zip');
                res.setHeader('Transfer-Encoding', 'chunked');

                var rootpath = config.uploadDir + "/" + filestop_cid;
                var zip = new tinyzip.TinyZip({rootpath: rootpath, utf8: true, compress: {level: 1}, fast: true});
                for (var i in result) {
                    var filename = rootpath + "/" + result[i].filename;
                    zip.addFile({file:filename})
                }
                var zipStream = zip.getZipStream();
                zipStream.pipe(res);
            }
        });

    };
    exports.upload = function (req, res) {
        var filestop_cid = req.params.cid;
        var chunk = parseInt(req.body.chunk || 0) + 1;
        var chunks = req.body.chunks || 1;
        console.log("upload called on filestop_cid " + filestop_cid + " chunk " + chunk + "/" + chunks);

        fs.readFile(req.files.file.path, function (err, data) {
            var fileDir = config.uploadDir + "/" + filestop_cid + "/";

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

                    if (chunk == chunks) {
                        fs.rename(filePathPart, filePath, function (err) {
                            fs.stat(filePath, function (err, stats) {
                                var filesize = stats.size;

                                var file = new File({filestopCId: filestop_cid, filename: req.body.name, size: filesize});

                                file.createClientId(config);

                                file.save(function (err) {
                                    if (!err) {
                                        res.send({success: "OK", cid: file.cid});
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
