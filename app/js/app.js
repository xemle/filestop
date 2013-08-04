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
        START_FILESTOP: 'Neuen FileStop erstellen &raquo;',
        HOME_HEADING:   'FileStop',
        HOME_TEXT:      'bla bla'
    });

    $translateProvider.translations('en_US', {
        START_FILESTOP: 'Start a new FileStop &raquo;',
        HOME_HEADING:   'FileStop',
        HOME_TEXT:      'Ever wondered how to easily share large files with your peers? FileStop is the solution for these problems. Start a new FileStop, drag and drop your files and then just share the URL with your friends.'
    });

    $translateProvider.preferredLanguage('de_DE');
}]);