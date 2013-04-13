var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fileSchema;

fileSchema = new Schema({
    filename: { type: String, validate: [function(value) {
        return value && value.length > 3;
    }, "Filename is to short"] },
    filepath: { type: String},
    size: { required: true, type: Number, min: 0 },
    filestop: { required: true, type: Schema.Types.ObjectId }
});

mongoose.model('File', fileSchema);
