angular.module("myApp")
    .controller("userHomeController", function ($scope, $http, $window,$rootScope) {
        self = this;
        $scope.currentToken = $window.localStorage.getItem('token');

        $scope.favBtn = {
            "background": "url('img/star_clicked.png')",
            "height": "48px",
            "width": "45px",
            "border": "none",
        }

        $scope.noFavBtn = {
            "background": "url('img/star_not_clicked.png')",
            "height": "48px",
            "width": "45px",
            "border": "none",
        }

        $scope.init = function () {
            //post request
            $http({
                    url: 'http://localhost:3000/users/getTwoRecommendInterestPoints',
                    method: "POST",
                    headers: {
                        'x-auth-token': $scope.currentToken
                    }
                })
                .then(function (response) {
                    $scope.recommendedPoi = response.data.PointsOfInterest;
                })
                .catch(function (err) {
                    console.log(err.data.Error)
                })
            $scope.getTwoLast();
        }

        $scope.getTwoLast = function () {
            $http({
                    url: 'http://localhost:3000/users/getTwoLastInterestPoints',
                    method: "POST",
                    headers: {
                        'x-auth-token': $scope.currentToken
                    }
                })
                .then(function (response) {
                    $scope.twoLastPoi = response.data.PointsOfInterest;
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
    });