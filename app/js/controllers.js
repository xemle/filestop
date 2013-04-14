'use strict';

/* Controllers */
angular.module('filestop.controllers', []).
    controller('homeCtrl', ["$scope", "$location", "$http", "filestopDAO", function ($scope, $location, $http, filestopDAO) {

        $scope.filestops = {};

        $scope.files = {};

        $scope.readRecentFilestops = function () {
            console.log('reading recent filestops');
            // TODO move this to the service provider
            $http({method: 'GET', url: '/filestop'})
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

        $scope.removeFilestop = function(cid) {
            console.log('deleting filestop ' + cid);
            // TODO move this to the service provider
            $http({method: 'DELETE', url: '/filestop/' + cid})
                .success(function(data, status, headers, config) {
                    $scope.readRecentFilestops();
                }).error(function(data, status, headers, config) {
                    console.log('error while deleting filestop' + cid);
                    alert(status + data);
                });
        };

        $scope.newFilestop = function () {
            console.log('creating new filestop');
            // TODO move this to the service provider
            $http({method: 'POST', url: '/filestop'}).
                success(function (data, status, headers, config) {
                    console.log('redirecting to the new filestop with cid ' + data.cid);
                    $location.path('/filestop/' + data.cid);
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
        $scope.filestopApi = $resource('/filestop/:cid', {cid: $routeParams.cid}, {get: {method: 'GET'}});
        $scope.fileApi = $resource('/filestop/:cid/files/:filecid', {cid: $routeParams.cid},
            {
                list: {method: 'GET', isArray: true},
                remove: {method: 'DELETE'}
            });

        $scope.filestop = $scope.filestopApi.get({});

        $scope.files = $scope.fileApi.list({});

        $scope.cid = $routeParams.cid;

        $scope.loadFiles = function() {
            $scope.files = $scope.fileApi.list({});
        };

        $scope.removeFile = function(filecid) {
            $scope.fileApi.remove({filecid: filecid}, function() {
                for (var i = $scope.files.length - 1; i >= 0; i--) {
                    if ($scope.files[i].cid == filecid) {
                        $scope.files.splice(i, 1);
                    }
                }
            });
        }

        if (!$scope.uploader) {
            $scope.uploader = uploader.create($routeParams.cid);
        } else {
            uploader.update($scope.uploader);
        }
        $scope.$on('file.upload.complete', function(scope, filestopCId, file) {
           if (filestopCId === $scope.cid) {
               $scope.loadFiles();
           }
        });

        $scope.loadFiles();
    }]);
