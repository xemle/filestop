'use strict';

// Declare app level module which depends on filters, and services
angular.module('filestop', ['filestop.filters', 'filestop.services', 'filestop.directives', 'filestop.controllers', 'ui', 'ui.bootstrap', 'ngResource', 'pascalprecht.translate']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeCtrl'});
    $routeProvider.when('/filestop/:cid', {templateUrl: 'partials/filestop.html', controller: 'filestopCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);


angular.module('filestop').config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('de_DE', {
        start_filestop: 'Neuen FileStop erstellen',
        index_title:    'FileStop - Teilen leichtgemacht',
        home_heading:   'FileStop',
        home_text:      'FileStop ist eine bequeme und schnelle Möglichkeit Dateien über das Internet anderen verfügbar zu machen. Man muss nur einen neuen FileStop erstellen, Dateien hineinziehen und die URL weitergeben.',
        filestop_shareURL: 'Teile den FileStop mit dieser URL:',
        filestop_statistics_1: 'Dein FileStop hat ',
        filestop_statistics_2: ' Dateien mit insgesamt',
        filestop_statistics_3: '.',
        file_name: 'Dateiname',
        file_size: 'Größe',
        file_options: 'Optionen',
        button_download_all: 'Alle herunterladen',
        button_download_selected: 'Selektierte herunterladen',
        info_add_files: 'Dateien hinzufügen',
        info_add_files_2: 'Dateien können einfach per Drag & Drop oder über den Dateiauswahldialog hinzugefügt werden',
        info_add_files_upload: 'Dateien hochladen',
        settings: 'Einstellungen',
        settings_created: 'Erstellt am',
        settings_updated: 'Zuletzt aktualisiert',
        settings_expires: 'Läuft ab am',
        footer_back: 'Zurück',
        footer_back_2: 'um einen neuen FileStop zu erstellen',
        footer_github: ' auf GitHub'

    });

    $translateProvider.translations('en_US', {
        start_filestop: 'Start a new FileStop',
        index_title:    'FileStop - share your things',
        home_heading:   'FileStop',
        home_text:      'Ever wondered how to easily share large files with your peers? FileStop is the solution for these problems. Start a new FileStop, drag and drop your files and then just share the URL with your friends.',
        filestop_shareURL: 'Share the files by using this URL:',
        filestop_statistics_1: 'Your Filestop has ',
        filestop_statistics_2: ' files with ',
        filestop_statistics_3: ' in total.',
        file_name: 'filename',
        file_size: 'size',
        file_options: 'options',
        button_download_all: 'download all',
        button_download_selected: 'download selected',
        info_add_files: 'Add files',
        info_add_files_2: 'Drag and drop your files into this window to upload them or use the button to open a file dialog',
        info_add_files_upload: 'Upload Files',
        settings: 'Settings',
        settings_created: 'Created on',
        settings_updated: 'Updated on',
        settings_expires: 'Expires on',
        footer_back: 'Back',
        footer_back_2: 'to create new filestop',
        footer_github: 'on GitHub'
    });

    $translateProvider.preferredLanguage('en_US');
}]);