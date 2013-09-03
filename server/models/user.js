var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

module.exports = function (config) {
    userSchema = new Schema({
        email: { type: String },
        passwordHash: { required: true, type: String },
        created: { type: Date, default: Date.now }
    });
    userSchema.methods.createPasswordHash = function(password) {
        var shasum = crypto.createHash('sha256');
        return shasum.update(password + config.salt, "utf8").digest("hex");
    };
    userSchema.methods.validatePassword = function (password) {
        var entered_hash = userSchema.methods.createPasswordHash(password);
        return (this.passwordHash == entered_hash)
    };

    mongoose.model('User', userSchema);
};
