'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('filestop.services', []).
  value('version', '0.1');

angular.module('filestop').factory('uploader', function() {
    var _uploaders = [];
    var service = {
        dnd: false
    };
    service.init = function(uploader) {
        var filestopId = uploader.settings.multipart_params.filestopId;
        console.log("Uploader for " + filestopId + " initialized");
        if (uploader.features.dragdrop) {
            service.dnd = true;
        }
    };

    service.create = function(filestopId) {
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash',
            browse_button: 'pickfiles',
            max_file_size: '2000mb',
            chunk_size: '1mb',
            url: 'files/upload',
            multipart: true,
            multipart_params : {
                filestopId: filestopId
            },
            flash_swf_url: 'js/plupload/plupload.flash.swf'
        });
        uploader.bind('Init', service.init);
        uploader.init();
        uploader.bind('FilesAdded', function(up, files) {
            console.log('' + files.length + ' files were added');
            up.start();
        });
        _uploaders.push(uploader);
        return uploader;
    };
    return service;
});

angular.module('filestop').factory('filestopDAO', function () {
    var service = {
        create: function () {

        },

        findAll: function () {
            $http({method: 'GET', url: '/filestops'})
                .success(function (data, status, headers, config) {
                    $scope.filestops = data;
                }).error(
                function (data, status, headers, config) {
                    console.log('error while reading current filestops');
                    alert(status + data);
                });
        }

    };

    return service;
});
