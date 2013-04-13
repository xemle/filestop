'use strict';

// Declare app level module which depends on filters, and services
angular.module('filestop', ['filestop.filters', 'filestop.services', 'filestop.directives', 'filestop.controllers', 'ui']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeCtrl'});
    $routeProvider.when('/filestop', {templateUrl: 'partials/filestop.html', controller: 'newFilestopCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);


