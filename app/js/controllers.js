'use strict';

/* Controllers */

angular.module('filestop.controllers', []).
    controller('homeCtrl', ["$scope", "$location", "$http", function ($scope, $location, $http) {

        $scope.filestops = {};

        $scope.readRecentFilestops = function () {
            console.log('reading recent filestops');
            $http({method: 'GET', url: '/filestops'})
                .success(function (data, status, headers, config) {
                    $scope.filestops = data;
                }).error(
                function (data, status, headers, config) {
                    console.log('error while reading current filestops');
                    alert(status + data);
                });
        };

        $scope.newFilestop = function () {
            console.log('creating new filestop');

            $http({method: 'POST', url: '/filestops'}).
                success(function (data, status, headers, config) {
                    console.log('redirecting to the new filestop with id ' + data.id);
                    $location.path('/filestop/' + data.id);
                }).
                error(function (data, status, headers, config) {
                    console.log('error while creating filestop');
                    alert(status + data);
                });
        };

        $scope.readRecentFilestops();

    }])
    .controller('filestopCtrl', ["$scope", "$routeParams", "$location", "$http", "uploader", function ($scope, $routeParams, $location, $http, uploader) {


        $scope.getId = function () {
            return $routeParams.id;
        }
        var up = uploader.create($routeParams.id);
    }]);
