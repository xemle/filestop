var fs = require('fs'),
    path = require('path'),
    child_process = require('child_process');

module.exports = function (config) {
    var exports = {}, convert = {};

    convert = function(args, errorCb, successCb) {
        var process = child_process.spawn(config.bin.convert, args);
        process.on('exit', function () {
            successCb();
        });
        process.on('error', function () {
            console.log("Failed to call " + bin + " with " + args.join(', '));
            errorCb();
        });
    };

    /**
     * Resize an image
     *
     * @param source Source filename
     * @param target Target filename
     * @param size Size of resized target image in pixel
     * @param errorCb Callback for error
     * @param successCb Callback for success
     */
    exports.resize = function(source, target, size, errorCb, successCb) {
        var args = [source, '-resize', size, '-auto-orient', '-strip', '-interlace', 'plane', '-quality', '85', target];
        convert(args, errorCb, successCb);
    };
    /**
     * Resize an image to a squared image
     *
     * @param source Source filename
     * @param target Target filename
     * @param size Size of squared target in pixel
     * @param errorCb Callback for error
     * @param successCb Callback for success
     */
    exports.square= function(source, target, size, errorCb, successCb) {
        var args = [source, '-resize', size + '^', '-extent', size, '-gravity', 'center', '-auto-orient', '-strip', '-interlace', 'plane', '-quality', '85', target];
        convert(args, errorCb, successCb);
    };
    return exports;
};
