var fs = require('fs'),
    path = require('path');

module.exports = function (config) {
    var exports = {};
    exports.sendFile = function(res, filename, mimeType) {
        mimeType = mimeType || 'image/jpeg'
        res.setHeader('Content-type', mimeType);

        var filestream = fs.createReadStream(filename);
        filestream.pipe(res);
    };
    exports.sendSquare = function(res, file, size) {
        var baseDir, filename, previewPath, squareFilename;

        baseDir = config.uploadDir + path.sep + file.filestopCId + path.sep;
        filename = baseDir + file.filename;
        previewPath = baseDir + '.previews' + path.sep;
        squareFilename = previewPath + file.filename + '.' + size + 'sq.jpg';

        if (!fs.existsSync(filename)) {
            res.send(404);
            return;
        }
        if (!fs.existsSync(squareFilename)) {
            if (!fs.existsSync(previewPath)) {
                fs.mkdirSync(previewPath);
            }
            var imageresizer = require('../lib/imageresizer')(config);
            imageresizer.square(filename, squareFilename, size, function() {
                res.send(500);
                return;
            }, function() {
                exports.sendFile(res, squareFilename);
            });
        } else {
            exports.sendFile(res, squareFilename);
        }
    };
    return exports;
};
