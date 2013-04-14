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
        };

        $scope.removeFilestop = function(id) {
            console.log('deleting filestop ' + id);
            // TODO move this to the service provider
            $http({method: 'DELETE', url: '/filestops/' + id})
                .success(function(data, status, headers, config) {
                    $scope.readRecentFilestops();
                }).error(function(data, status, headers, config) {
                    console.log('error while deleting filestop' + id);
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
        $scope.readRecentFiles();

    }])
    .controller('filestopCtrl', ["$scope", "$routeParams", "$location", "$http", "$resource", "uploader", function ($scope, $routeParams, $location, $http, $resource, uploader) {
        $scope.filestopApi = $resource('/filestops/:id', {id: $routeParams.id}, {get: {method: 'GET'}});
        $scope.fileApi = $resource('/filestops/:id/files/:fileid', {id: $routeParams.id},
            {
                list: {method: 'GET', isArray: true},
                remove: {method: 'DELETE'}
            });

        $scope.filestop = $scope.filestopApi.get({});

        $scope.files = $scope.fileApi.list({});

        $scope.id = $routeParams.id;

        $scope.loadFiles = function() {
            $scope.files = $scope.fileApi.list({});
        };

        $scope.removeFile = function(fileid) {
            $scope.fileApi.remove({fileid: fileid}, function() {
                for (var i = $scope.files.length - 1; i >= 0; i--) {
                    if ($scope.files[i]._id == fileid) {
                        $scope.files.splice(i, 1);
                    }
                }
            });
        }

        if (!$scope.uploader) {
            $scope.uploader = uploader.create($routeParams.id);
        } else {
            uploader.update($scope.uploader);
        }
        $scope.$on('file.upload.complete', function(scope, filestopId, file) {
           if (filestopId === $scope.id) {
               $scope.loadFiles();
           }
        });

        $scope.loadFiles();
    }]);
