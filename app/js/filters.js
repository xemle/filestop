'use strict';

/* Filters */

angular.module('filestop.filters', []).
    filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }])
    .filter('prettyDate', ['date', function (date) {
        return function (date) {
            return $scope.prettyDate(date);
        }
    }]);
