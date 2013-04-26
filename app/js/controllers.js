'use strict';

/* Controllers */
angular.module('filestop.controllers', []).
    controller('homeCtrl', ["$scope", "$location", "$http", "$resource", "$routeParams", function ($scope, $location, $http, $resource, $routeParams) {
        $scope.filestopApi = $resource('filestop/:cid', { },
            {
                list: {method: 'GET', isArray: true},
                remove: {method: 'DELETE'}
            });

        $scope.filestops = $scope.filestopApi.list();

        $scope.removeFilestop = function(cid) {
            console.log('deleting filestop ' + cid);

            $scope.filestopApi.remove({cid: cid}, function() {
                for (var i = $scope.filestops.length - 1; i >= 0; i--) {
                    if ($scope.filestops[i].cid == cid) {
                        $scope.filestops.splice(i, 1);
                    }
                }
            });

            /*
            // TODO move this to the service provider
            $http({method: 'DELETE', url: '/filestop/' + cid})
                .success(function(data, status, headers, config) {
                    $scope.readRecentFilestops();
                }).error(function(data, status, headers, config) {
                    console.log('error while deleting filestop' + cid);
                    alert(status + data);
                });
                */
        };

        $scope.newFilestop = function () {
            console.log('creating new filestop');
            // TODO move this to the service provider
            $http({method: 'POST', url: 'filestop'}).
                success(function (data, status, headers, config) {
                    console.log('redirecting to the new filestop with cid ' + data.cid);
                    $location.path('filestop/' + data.cid);
                }).
                error(function (data, status, headers, config) {
                    console.log('error while creating filestop', data);
                    alert("Could not create a new filestop");
                });
        };

    }])
    .controller('filestopCtrl', ["$scope", "$routeParams", "$location", "$http", "$resource", "UploadService", function ($scope, $routeParams, $location, $http, $resource, uploadService) {
        var filestopCid = $routeParams.cid;
        $scope.filestopApi = $resource('filestop/:cid', {cid: $routeParams.cid},
            {
                get: {method: 'GET'},
                update: {method: 'PUT'}
            });
        $scope.fileApi = $resource('filestop/:cid/files/:filecid', {cid: filestopCid},
            {
                list: {method: 'GET', isArray: true},
                remove: {method: 'DELETE'},
                downloadAll: {method: 'POST'}
            });

        $scope.cid = filestopCid;
        $scope.filestop = $scope.filestopApi.get({});
        $scope.files = [];
        $scope.uploadFiles = [];

        $scope.updateFiles = function() {
            $scope.files = $scope.fileApi.list({});
        };

        $scope.upadateUploadFiles= function() {
            $scope.$apply(function() {
                $scope.uploadFiles = uploadService.getFiles(filestopCid);
            });
        };

        $scope.removeFile = function(fileCid) {
            $scope.fileApi.remove({filecid: fileCid}, function() {
                for (var i = $scope.files.length - 1; i >= 0; i--) {
                    if ($scope.files[i].cid == fileCid) {
                        $scope.files.splice(i, 1);
                    }
                }
            });
        };

        $scope.updateFilestop = function() {
            console.log('updating filestop');
            $scope.filestopApi.update(
                {
                    name: $scope.filestop.name,
                    description: $scope.filestop.description
                });
        };

        $scope.getTotalFileSize = function() {
            var size = 0;
            for (var i in $scope.files) {
                size += $scope.files[i].size;
            }
            return size;
        };

        // file selection handling
        $scope.allSelected = false;
        $scope.selectAll = function() {
            for (var i in $scope.files) {
                $scope.files[i].selected = $scope.allSelected;
            }
        };
        $scope.checkSelected = function() {
            var allSelected = true, allDeselected = true;
            for (var i in $scope.files) {
                allSelected = allSelected && $scope.files[i].selected;
                allDeselected = allDeselected && !$scope.files[i].selected;
            }
            if (allSelected) {
                $scope.allSelected = true;
            } else if (allDeselected) {
                $scope.allSelected = false;
            }
        };

        // Multiple download
        $scope.downloadSelected = function() {
            var cids = [];
            for (var i in $scope.files) {
                if ($scope.files[i].selected) {
                    cids.push($scope.files[i].cid);
                }
            }
            if (cids.length > 0) {
                // work around to trigger download
                var url = "filestop/" + $scope.cid + "/files";
                var inputs = '<input type="hidden" name="fileCids" value="' + cids.join(',') + '"/>';
                jQuery('<form action="'+ url +'" method="post">'+inputs+'</form>').appendTo('body').submit().remove();
            }
        };
        $scope.disableDownloadButton = function() {
            for (var i in $scope.files) {
                if ($scope.files[i].selected) {
                    return false;
                }
            }
            return true;
        };

        // Hook upload service
        if (!$scope.uploader) {
            $scope.uploader = uploadService.create(filestopCid);
        } else {
            uploadService.update($scope.uploader);
        }
        $scope.$on('uploads:complete', function(scope, filestopCid, file) {
            if (filestopCid === $scope.cid) {
                $scope.updateFiles();
            }
        });
        $scope.$on('uploads:change', function(scope, filestopCid, file) {
            if (filestopCid === $scope.cid) {
                $scope.upadateUploadFiles();
            }
        });
        $scope.getDropZoneClass = function() {
            return uploadService.dnd ? '' : 'hide';
        };

        $scope.updateFiles();
    }]);
