var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    fs = require('fs'),
    path = require('path'),
    deleteFolderRecursive,
    File = mongoose.model('File');

deleteFolderRecursive = function(dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(function(file, index){
            var curDir = dir + path.sep + file;
            if (file == '.' || file == '..') {
                return;
            } else if (fs.statSync(curDir).isDirectory()) {
                deleteFolderRecursive(curDir);
            } else {
                fs.unlinkSync(curDir);
            }
        });
        fs.rmdirSync(dir);
    }
};

module.exports = function (config) {
    var filestopSchema = new Schema({
        name: { type: String, validate: [function(value) {
            return value && value.length > 3;
        }, "Name is to short"], default: "Unnamed" },
        description: { type: String, validate: [function(value) {
            return !value || value.length < 500;
        }, "Description is too long"], default: "" },
        cid: {type: String},
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
        expires: { type: Date, default: function() {
            var result = new Date();
            result.setTime(result.getTime() + config.defaultExpireOffset * 1000);
            return result;
        }, validate: [function(value) {
            if (!value) {
                return false;
            }
            var expired = value.getTime(), now = new Date().getTime(), max = new Date(now + config.maxExpireOffset * 1000).getTime();
            return expired > now && expired < max;
        }, "Expiration date must be in the future"]},
        keep: { type: Boolean, default: false },
        _userId: { type: Schema.Types.ObjectId, ref: 'User' }
    }, {
        toJSON: {
            virtuals: true
        }
    });
    filestopSchema.virtual('url').get(function () {
        return config.baseURL + '/#/filestop/' + this.cid;
    });

    filestopSchema.methods.createClientId = function (config) {
        var shasum = crypto.createHash('sha1');
        this.cid = shasum.update (this._id + config.salt, "ascii")
            .digest("base64")
            .replace(/[\+\/]/g,'')
            .substring(0,12);
    };
    filestopSchema.methods.deleteAllFileModels = function () {
        // delete all files
        File.find({filestopCId: this.cid}, function (err, result) {
            if (err) {
                console.log("Error querying for files of filestop with cid " + this.cid, err);
                return;
            }
            if (result) {
                result.forEach (function (file) {
                    file.remove();
                });
            }
        });
    };

    filestopSchema.methods.deleteFolder = function (config, callback) {
        var filestopPath = config.uploadDir + path.sep + this.cid;
        console.log("Deleting Filestop folder at " + filestopPath);
        deleteFolderRecursive(filestopPath);
        callback();
    };

    mongoose.model('Filestop', filestopSchema);
};
