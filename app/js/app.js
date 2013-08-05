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
        START_FILESTOP: 'Neuen FileStop erstellen',
        INDEX_TITLE:    'FileStop - Teilen leichtgemacht',
        HOME_HEADING:   'FileStop',
        HOME_TEXT:      'FileStop ist eine bequeme und schnelle Möglichkeit Dateien über das Internet anderen verfügbar zu machen. Man muss nur einen neuen FileStop erstellen, Dateien hineinziehen und die URL weitergeben.',
        filestop_shareURL: 'Teile den FileStop mit dieser URL:'
    });

    $translateProvider.translations('en_US', {
        START_FILESTOP: 'Start a new FileStop',
        INDEX_TITLE:    'FileStop - share your things',
        HOME_HEADING:   'FileStop',
        HOME_TEXT:      'Ever wondered how to easily share large files with your peers? FileStop is the solution for these problems. Start a new FileStop, drag and drop your files and then just share the URL with your friends.',
        filestop_shareURL: 'Share files by sending URL:'
    });

    $translateProvider.preferredLanguage('de_DE');
}]);