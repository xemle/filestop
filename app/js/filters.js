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
            return jQuery.timeago(text);
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
    });
