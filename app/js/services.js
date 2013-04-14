'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('filestop.services', []).
  value('version', '0.1');

angular.module('filestop').factory('uploader', function($rootScope) {
    var _uploaders = [];
    var service = {
        dnd: false,
        files: [],
        started: false,
        estimatedEnd: false,
        process: 100,
        state: 'IDLE'
    };
    service.init = function(uploader) {
        var filestopId = uploader.settings.url;
        console.log("Uploader for " + filestopId + " initialized");

        if (uploader.features.dragdrop) {
            service.dnd = true;
        }
    };

    service.clear = function() {
        service.state = 'IDLE';
        service.process = 100;
        service.started = false;
        service.estimatedEnd = false;
        service.files.splice(0, service.files.length);
    };
    service.updateProcess = function() {
        if (!service.files.length) {
            return;
        } else if (!service.started) {
            service.state = 'UPLOADING';
            service.started = new Date();
            service.estimatedEnd = new Date();
        }
        var process = 0, clear = true;
        for (var i in service.files) {
            process += service.files[i].percent;
            clear = clear && (service.files[i].percent == 100);
        }
        service.process = process / service.files.length;
        if (clear) {
            console.log("Uploading of " + service.files.length + " files is done");
            service.clear();
        } else {
            var now = new Date().getTime(), diff = now - service.started.getTime();
            service.estimatedEnd.setTime(now + diff * (100 - service.process));
            //console.log("Process is " + service.process + ". Estimated end is " + service.estimatedEnd.toLocaleString());
        }
    };
    service.create = function(filestopCId) {
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash',
            browse_button: 'pickfiles',
            max_file_size: '2000mb',
            chunk_size: '1mb',
            url: 'filestop/' + filestopCId + '/upload',
            drop_element: 'dropzone',
            multipart: true,
            flash_swf_url: 'js/plupload/plupload.flash.swf'
        });
        uploader.bind('Init', service.init);
        uploader.init();
        uploader.bind('FilesAdded', function(up, files) {
            console.log('' + files.length + ' files were added');
            for (var i in files) {
                files[i].filestopCId = filestopCId;
                service.files.push(files[i]);
            }
            up.start();
        });
        uploader.bind('UploadProgress', function(up, file) {
            service.updateProcess();
        });
        uploader.bind('FileUploaded', function(up, file, response) {
            console.log("File " + file.name + " uploaded", response);
            service.updateProcess();
            $rootScope.$broadcast('file.upload.complete', filestopCId, file);
        });
        _uploaders.push(uploader);
        return uploader;
    };
    service.update = function(uploader) {
        plupload.init(uploader);
    };
    return service;
});
