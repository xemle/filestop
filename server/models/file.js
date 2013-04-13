var mongoose = require('mongoose'),
    fs = require('fs'),
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

fileSchema.methods.deleteFile = function () {
    console.log("Deleting file at " + this.filepath);
    fs.unlink(this.filepath, function (err) {
        if (err) {
            console.log("Error deleting file " + this.filepath, err);
            return;
        }
    });
}

mongoose.model('File', fileSchema);
