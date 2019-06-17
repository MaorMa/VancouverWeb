angular.module("myApp")
    .controller("homeController", function ($scope, $http, redirect) {
        self = this;


        $scope.redirect = function (location) {
            redirect.redirect(location);
        };

        $scope.getExplore = function () {
            //get random explore points
            $http({
                url: 'http://localhost:3000/poi/getExplorePoints',
                method: "GET"
            })
                .then(function (response) {
                    $scope.explorePoints = response.data.PointsOfInterest;
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
        
    });