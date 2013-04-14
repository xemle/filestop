var mongoose = require('mongoose'),
    fs = require('fs'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    fileSchema;

fileSchema = new Schema({
    filename: { type: String, validate: [function(value) {
        return value && value.length > 3;
    }, "Filename is to short"] },
    cid: { required: true, type: String },
    created: { type: Date, default: Date.now },
    size: { required: true, type: Number, min: 0 },
    filestopCId: { required: true, type: String }
});

fileSchema.methods.deleteFile = function (config) {
    var filePath = config.uploadDir + "/" + this.filestopCId + "/" + this.filename;
    console.log("Deleting file at " + filePath);
    fs.unlink(filePath, function (err) {
        if (err) {
            console.log("Error deleting file " + filePath, err);
            return;
        }
    });
}

fileSchema.methods.createClientId = function (config) {
    var shasum = crypto.createHash('sha1');
    this.cid = shasum.update (this._id + config.salt, "ascii")
        .digest("base64")
        .replace('+','')
        .replace('/','')
        .substring(0,12);
}

mongoose.model('File', fileSchema);
