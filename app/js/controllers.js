'use strict';

/* Controllers */

angular.module('filestop.controllers', []).
    controller('homeCtrl', ["$scope", "$location", "$http", function ($scope, $location, $http) {
        $scope.newFilestop = function() {
            console.log('creating new filestop');

            $http({method: 'POST', url: '/filestops'}).
                success(function(data, status, headers, config) {
                    console.log('redirecting to the new filestop');
                    alert(data);
                    $location.path('/filestop/' + '4711');
                }).
                error(function(data, status, headers, config) {
                    console.log('error while creating filestop');
                    alert(status + data);
                });


        }
    }])
    .controller('filestopCtrl', [function () {

    }]);