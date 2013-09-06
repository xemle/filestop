'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('filestop.services', []).
  value('version', '0.1');

angular.module('filestop').factory('UploadService', function($rootScope) {
    var _uploaders = [];
    var service = {
        dnd: false,
        files: {}
    };
    service.create = function(filestopCid) {
        service.files[filestopCid] = service.files[filestopCid] || [];
        var filestopUploader = new plupload.Uploader({
            runtimes: 'html5,flash',
            browse_button: 'pickfiles',
            max_file_size: '2000mb',
            chunk_size: '1mb',
            url: 'filestop/' + filestopCid + '/upload',
            drop_element: 'dropzone',
            multipart: true,
            flash_swf_url: 'js/plupload/plupload.flash.swf'
        });
        filestopUploader.filestopCid = filestopCid;
        filestopUploader.bind('Init', function() {
            if (filestopUploader.features.dragdrop) {
                service.dnd = true;
            }
        });
        filestopUploader.init();
        filestopUploader.bind('FilesAdded', function(uploader, newFiles) {
            var filestopCid = uploader.filestopCid, files = service.files[filestopCid];
            for (var i in newFiles) {
                newFiles[i].filestopCid = uploader.filestopCid;
                files.push(newFiles[i]);
            }
            console.log('' + newFiles.length + ' files were added to ' + filestopCid);
            uploader.start();
        });
        filestopUploader.bind('UploadProgress', function(uploader, file) {
            $rootScope.$broadcast('uploads:change', file.filestopCid, file);
        });
        filestopUploader.bind('FileUploaded', function(uploader, file, response) {
            var filestopCid = uploader.filestopCid, files = service.files[filestopCid];
            for (var i = files.length - 1; i >= 0; i--) {
                if (files[i].id == file.id) {
                    files.splice(i, 1);
                }
            }
            console.log("File " + file.name + " uploaded", response);
            $rootScope.$broadcast('uploads:complete', filestopCid, file);
        });
        _uploaders.push(filestopUploader);
        return filestopUploader;
    };
    service.getFiles = function(filestopCid) {
        return service.files[filestopCid] ? service.files[filestopCid] : [];
    };
    service.update = function(uploader) {
        plupload.init(uploader);
    };
    return service;
}]).factory('userService', ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {
        var _user = null;
        return {
            login: function(user) {
                var deferred = $q.defer();
                $http.post('/users/login', user)
                    .success(function(user) {
                        _user = user;
                        deferred.resolve(user);
                    })
                    .error(function(data) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            logout: function() {
                var deferred = $q.defer();
                $http.get('/users/logout')
                    .success(function() {
                        _user = null;
                        deferred.resolve();
                    })
                    .error(function(data) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            loggedin: function() {
                return (_user != null);
            },
            getUsername: function() {
                if (_user) {
                    return _user.email;
                }
                return null;
            },
            fetchUser: function() {
                var deferred = $q.defer();
                $http.get('loggedin')
                    .success(function(user) {
                        if (user !== '0') {
                            _user = user;
                        } else {
                            _user = null;
                        }
                        deferred.resolve();
                    })
                    .error(function(data) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            signup: function(user) {
                var deferred = $q.defer();
                $http.post('/users/signup', user)
                    .success(function(user) {
                        _user = user;
                        deferred.resolve();
                    })
                    .error(function(data) {
                        deferred.reject();
                    });
                return deferred.promise;
            }
        };
    }]);
