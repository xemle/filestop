'use strict';

/* Controllers */
angular.module('filestop.controllers', []).
    controller('homeCtrl', ["$scope", "$location", "$http", "filestopDAO", function ($scope, $location, $http, filestopDAO) {

        $scope.filestops = {};

        $scope.readRecentFilestops = function () {
            console.log('reading recent filestops');
            // TODO move this to the service provider
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
            // TODO move this to the service provider
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

        $scope.filestop = {};

        $scope.files = {};

        $scope.getId = function () {
            return $routeParams.id;
        };

        $scope.readFilestop = function () {
            var id = $routeParams.id;
            console.log('reading filestop ' + id);
            // TODO move this to the service provider
            $http({method: 'GET', url: '/filestops/' + id})
                .success(function (data, status, headers, config) {
                    $scope.filestop = data;
                }).error(
                function (data, status, headers, config) {
                    console.log('error while reading filestop ' + id);
                    alert(status + data);
                });
        }

        $scope.readRecentFiles = function () {
            console.log('reading files');
            // TODO move this to the service provider
            $http({method: 'GET', url: '/files'})
                .success(function (data, status, headers, config) {
                    $scope.files = data;
                }).error(
                function (data, status, headers, config) {
                    console.log('error while reading files');
                    alert(status + data);
                });
        };

        // load the data
        $scope.readFilestop();
        $scope.readRecentFiles();

        var up = uploader.create($routeParams.id);
    }]);