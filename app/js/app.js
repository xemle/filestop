// Declare app level module which depends on filters, and services
angular.module('filestop', ['filestop.filters', 'filestop.services', 'filestop.directives', 'filestop.controllers', 'ui', 'ui.bootstrap', 'ngResource']).
    config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') {
                    $timeout(deferred.resolve, 0);
                }

                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    $timeout(function() { deferred.reject(); }, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
        $httpProvider.responseInterceptors.push(function($q, $location) {
            return function (promise) {
                return promise.then(
                    // Success: just return the response
                    function (response) {
                        return response;
                    },
                    // Error: check the error status to get only the 401
                    function (response) {
                        if (response.status === 401) {
                            $location.url('/login');
                        }
                        return $q.reject(response);
                    }
                );
            }
        });
        $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeCtrl'});
        $routeProvider.when('/filestops', {templateUrl: 'partials/filestops.html', controller: 'filestopsCtrl'});
        $routeProvider.when('/filestop/:cid', {templateUrl: 'partials/filestop.html', controller: 'filestopCtrl'});
        $routeProvider.when('/signup', {templateUrl: 'partials/signupDialog.html', controller: 'signupDialogCtrl'});
        $routeProvider.when('/login', {templateUrl: 'partials/loginDialog.html', controller: 'loginDialogCtrl'});
        $routeProvider.otherwise({redirectTo: '/home'});

        jQuery.timeago.settings.allowFuture = true;
    }]);
