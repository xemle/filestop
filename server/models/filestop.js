var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    filestopSchema;

filestopSchema = new Schema({
    name: { required: true, type: String, validate: [function(value) {
        return value && value.length > 3;
    }, "Filename is to short"] },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    expires: { type: Date, default: Date.now }
});

mongoose.model('Filestop', filestopSchema);
