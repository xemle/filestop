'use strict';

/* Controllers */
angular.module('filestop.controllers', []).
    controller('homeCtrl', ["$scope", "$location", "$http", "filestopDAO", function ($scope, $location, $http, filestopDAO) {

        $scope.filestops = {};

        $scope.files = {};

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

        $scope.readRecentFiles = function() {
            console.log('reading recent files');
            // TODO move this to the service provider
            $http({method: 'GET', url: '/files'})
                .success(function(data, status, headers, config) {
                    $scope.files = data;
                }).error(function(data, status, headers, config) {
                    console.log('error while reading current filestops');
                    alert(status + data);
                });
        }

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
        $scope.readRecentFiles();

    }])
    .controller('filestopCtrl', ["$scope", "$routeParams", "$location", "$http", "$resource", "uploader", function ($scope, $routeParams, $location, $http, $resource, uploader) {
        $scope.filestopApi = $resource('/filestops/:id', {id: $routeParams.id}, {get: {method: 'GET'}});
        $scope.fileApi = $resource('/filestops/:id/files', {id: $routeParams.id}, {get: {method: 'GET', isArray: true}});

        $scope.filestop = $scope.filestopApi.get({});
        $scope.files = $scope.fileApi.get({});

        $scope.id = $routeParams.id;

        if (!$scope.uploader) {
            $scope.uploader = uploader.create($routeParams.id);
        } else {
            uploader.update($scope.uploader);
        }
    }]);
