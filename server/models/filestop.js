var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    filestopSchema;

filestopSchema = new Schema({
    name: { type: String, validate: [function(value) {
        return value && value.length > 3;
    }, "Name is to short"], default: "Unnamed" },
    cid: {type: String},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    expires: { type: Date, default: Date.now }
});

filestopSchema.methods.createClientId = function (config) {
    var shasum = crypto.createHash('sha1');
    this.cid = shasum.update (this._id + config.salt, "ascii")
        .digest("base64")
        .replace('+','-')
        .replace('/','_')
        .substring(0,12);
}

mongoose.model('Filestop', filestopSchema);
