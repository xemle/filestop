'use strict';

/* Filters */

angular.module('filestop.filters', []).
    filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }])
    .filter('prettyDate', function () {
        return function (text, length, end) {
            if (text) {
                return jQuery.timeago(text);
            } else {
                return text;
            }
        }
    })
    .filter('prettySize', function () {
        return function (text, length, end) {
            var number = Number(text);

            if(isNaN(number)) {
                return ' ';
            }

            if(number < 500) {
                return number;
            } else if(number < 500 * 1024) {
                return (number / 1024).toFixed(2) + ' K';
            } else if(number < 500 * Math.pow(1024, 2)) {
                return (number / Math.pow(1024,2)).toFixed(2) + ' M';
            } else if(number < 500 * Math.pow(1024, 3)) {
                return (number / Math.pow(1024, 3)).toFixed(2) + ' G';
            }

            return number;
        }
    })
    .filter('filenameLimit', function () {
        return function (text, length, end) {
            if (text.length < 40) {
                return text;
            }
            var dot = text.lastIndexOf('.'), ext = '';
            if (dot > 0) {
                ext = text.substr(dot);
            }
            if (ext.length < 10) {
                return text.substr(0, 43 - ext.length) + '..' + ext;
            } else {
                return text.substr(0, 30) + '...' + text.substr(text.length - 5);
            }
        }
    })
    .filter('uploadStatus', function () {
        return function (number) {
            if (number == 2) {
                return 'uploading...'
            } else if (number == 1) {
                return '(queued)'
            } else {
                return '';
            }
        }
    })
    .filter('imageFiles', function() {
        return function (files) {
            if (!files || !files.length) {
                return files;
            }
            var imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            return files.filter(function(file) {
                if (!file.hasOwnProperty('filename')) {
                    return false;
                }
                var filename = file.filename, ext;
                ext = filename.substring(filename.lastIndexOf('.') + 1).toLocaleLowerCase();
                return imageExtensions.indexOf(ext) >= 0;
            });
        }
    });
