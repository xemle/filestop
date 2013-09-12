var mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    Schema = mongoose.Schema;

module.exports = function (config) {
    var fileSchema = new Schema({
        filename: { type: String, validate: [function(value) {
            return value && value.length > 3;
        }, "Filename is to short"] },
        cid: { required: true, type: String },
        created: { type: Date, default: Date.now },
        size: { required: true, type: Number, min: 0 },
        filestopCId: { required: true, type: String }
    });

    fileSchema.methods.deleteFile = function (config, callback) {
        var filePath = config.uploadDir + path.sep + this.filestopCId + path.sep + this.filename;
        console.log("Deleting file at " + filePath);
        fs.unlink(filePath, function (err) {
            if (err) {
                console.log("Error deleting file " + filePath, err);
            }

            if (typeof(callback) == "function")
                callback(err);
        });
    };

    fileSchema.methods.createClientId = function (config) {
        var shasum = crypto.createHash('sha1');
        this.cid = shasum.update (this._id + config.salt, "ascii")
            .digest("base64")
            .replace(/[\+\/]/g,'')
            .substring(0,12);
    };

    mongoose.model('File', fileSchema);
};
