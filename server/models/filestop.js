var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    fs = require('fs'),
    filestopSchema;

filestopSchema = new Schema({
    name: { type: String, validate: [function(value) {
        return value && value.length > 3;
    }, "Name is to short"], default: "Unnamed" },
    description: { type: String, validate: [function(value) {
        return !value || value.length < 500;
    }, "Description is too long"], default: "" },
    cid: {type: String},
    url: {type: String},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    expires: { type: Date, default: Date.now }
});

filestopSchema.methods.createClientId = function (config) {
    var shasum = crypto.createHash('sha1');
    this.cid = shasum.update (this._id + config.salt, "ascii")
        .digest("base64")
        .replace('+','')
        .replace('/','')
        .substring(0,12);
};

filestopSchema.methods.deleteFolder = function (config, callback) {
    var filestopPath = config.uploadDir + "/" + this.cid + "/";
    console.log("Deleting Filestop folder at " + filestopPath);
    fs.rmdir(filestopPath, function (err) {
        if (err) {
            console.log("Error deleting Filestop path " + filestopPath, err);
        }

        if(typeof(callback) == "function")
            callback(err);
    });
};

mongoose.model('Filestop', filestopSchema);
