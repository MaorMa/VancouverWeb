angular.module("myApp")
    .controller("aboutController", function ($scope, $http, redirect) {
        self = this;

        $scope.redirect = function (location) {
            redirect.redirect(location);
        }
    });