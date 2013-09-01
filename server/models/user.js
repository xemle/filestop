var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    userSchema;

module.exports = function (config) {
    userSchema = new Schema({
        uid: { required: true, type: Number },
        /* \todo: validate email address */
        emailAddress: { required: true, type: String },
        displayName: { type: String },
        passwordHash: { required: true, type: String },
        created: { type: Date, default: Date.now }
    });

    userSchema.methods.validatePassword = function (password) {
        var shasum = crypto.createHash('sha256');
        var entered_hash = shasum.update(password + config.salt, "utf8").digest("hex");

        if (this.passwordHash == entered_hash)
            return true;

        return false;
    }

    mongoose.model('User', userSchema);
}
