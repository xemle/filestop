'use strict';

/* Controllers */
angular.module('filestop.controllers', []).
    controller('homeCtrl', ["$scope", "$location", "$http", "$resource", "$routeParams", function ($scope, $location, $http, $resource, $routeParams) {
        $scope.filestopApi = $resource('filestop/:cid', { },
            {
                remove: {method: 'DELETE'}
            });

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
    .controller('filestopCtrl', ["$scope", "$routeParams", "$location", "$http", "$resource", "UploadService", "$filter", "$dialog", function ($scope, $routeParams, $location, $http, $resource, uploadService, $filter, $dialog) {
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
        $scope.filestop = $scope.filestopApi.get({}, function() {}, function(response) {
            if (response.status == 404) {
                $location.path('/');
            }
        });
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
        $scope.downloadAll = function() {
            var cids = [];
            for (var i in $scope.files) {
                cids.push($scope.files[i].cid);
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

        $scope.timeToLive = function() {
            var now = new Date().getTime(), expires = new Date().getTime();
            if ($scope.filestop.expires) {
                expires = new Date($scope.filestop.expires).getTime()
            }
            if (now < expires) {
                return Math.floor((expires - now) / 1000);
            } else {
                return 0;
            }
        };
        $scope.expireDate = function(dateFormat) {
            var ttl = $scope.timeToLive(), text = "", days, hours, minutes;
            dateFormat = dateFormat || 'd. MMM y';
            days = Math.floor(ttl / (3600 * 24));
            ttl = ttl - (days * 3600 * 24);
            hours = Math.floor(ttl / 3600);
            ttl = ttl - (hours * 3600);
            minutes = Math.floor(ttl / 60);

            if (days > 6) {
                text = ""
            } else if (days > 2) {
                text = " (expires in " + days + " days)";
            } else if (days > 0) {
                text = " (expires in " + days + " days and " + hours + " hours)";
            } else if (hours > 0) {
                text = " (expires in " + hours + " hours and " + minutes + " minutes)";
            } else if (minutes > 0) {
                text = " (expires in " + minutes + " minutes)";
            } else {
                text = " (expired)";
            }
            return $filter('date')($scope.filestop.expires, dateFormat) + text;
        };
        $scope.expireStyle = function() {
            var ttl = $scope.timeToLive(), days;
            days = Math.floor(ttl / (3600 * 24));
            if (days < 10) {
                return {color: 'red'}
            } else {
                return {}
            }
        };


        $scope.openDialog = function() {
            var dialog = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: true,
                templateUrl: 'partials/editDialog.html',
                controller: 'editDialogCtrl',
                resolve: {
                    filestop: function() { return $scope.filestop },
                    filestopApi: function() { return $scope.filestopApi }
                }
            });
            dialog.open().then(function(reload){
                if (reload) {
                    $scope.filestop = $scope.filestopApi.get({});
                }
            });
        };
        $scope.updateFiles();

        // Gallery functions
        $scope.selectImage = function(file) {
            file.selected = !file.selected;
            return false;
        };
        $scope.thumbnailClass = function(file) {
            if (file.selected) {
                return 'thumbnail-selected';
            }
            return '';
        }
    }])
    .controller('editDialogCtrl', ['$scope', '$filter', 'dialog', 'filestop', 'filestopApi', function($scope, $filter, dialog, filestop, filestopApi) {
        $scope.filestop = filestop;
        $scope.expires = $filter('date')($scope.filestop.expires, 'd.MM.y HH:mm:ss');
        $scope.name = $scope.filestop.name;
        $scope.description = $scope.filestop.description;
        $scope.keep = $scope.filestop.keep;
        $scope.error = false;
        $scope.parseDate = function(date) {
            var parts = date.split(' '), d, t;
            if (parts.length != 2) {
                return $scope.filestop.expires;
            }
            d = parts[0].split('.');
            t = parts[1].split(':');
            if (d.length != 3 || t.length != 3) {
                return $scope.filestop.expires;
            }
            return new Date(d[2], d[1] - 1, d[0], t[0], t[1], t[2]);
        };
        $scope.save = function() {
            var expires = $scope.parseDate($scope.expires);
            filestopApi.update(
                {
                    name: $scope.name,
                    description: $scope.description,
                    expires: expires,
                    keep: $scope.keep
                }, function() {
                    dialog.close(true);
                }, function(err) {
                    $scope.error = "Could not save: " + err.data.message;
                });
        };
        $scope.cancel = function() {
            dialog.close();
        }
    }]);