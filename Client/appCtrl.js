angular.module('myApp')
    .service('redirect', function ($location) {
        this.redirect = function (location) {
            $location.path(location);
        }
    })
    .controller('appCtrl', function ($scope, $window, $rootScope, $http, redirect) {
        self = this;
        $rootScope.currUser = "Guest";
        $rootScope.loggedIn = false;
        $rootScope.favorites = [];
        $rootScope.ranks = [1, 2, 3, 4, 5];
        $rootScope.infoVisible = false;
        $rootScope.show_me = false;
        $rootScope.rank = 0;
        $rootScope.TextReview = "";

        $scope.logout = function () {
            $window.alert("You are being logged out");
            $rootScope.currUser = "Guest";
            $rootScope.loggedIn = false;
            $rootScope.favorites = [];
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('username');
        }

        $scope.initialize = function (){
            let token = $window.localStorage.getItem('token');
            let username = $window.localStorage.getItem('username');
            if(token!=undefined && username!=undefined){
                //console.log(token + " " + username);
                $rootScope.currUser = username;
                $rootScope.loggedIn = true;
                $rootScope.getFavorites();
                redirect.redirect("userHome");
            }
        }

        $rootScope.showDetails = function (poi) {
            if ($rootScope.show_me)
                $rootScope.show_me = !$rootScope.show_me;

            //console.log($rootScope.infoVisible)
            if ($rootScope.infoVisible)
                $rootScope.addViewer(poi.PointName);

            if ($rootScope.currPoi == poi || !$rootScope.infoVisible) {
                $rootScope.currPoi = poi;
                $rootScope.infoVisible = !$rootScope.infoVisible;
            }
            $rootScope.currPoi = poi;
            $http({
                    url: 'http://localhost:3000/poi/getPointDetails',
                    method: "GET",
                    params: {
                        'PointName': poi.PointName
                    }
                })
                .then(function (response) {
                    //console.log(response.data.PointDetails);
                    $rootScope.currFullPoi = response.data.PointDetails;
                })
        }

        $rootScope.addViewer = function (poiName) {
            $http({
                    url: 'http://localhost:3000/poi/addViewer',
                    method: "GET",
                    params: {
                        'PointName': poiName
                    }
                })
                .then(function (response) {})
        }

        $rootScope.addReview = function (rank, TextReview) {
            $rootScope.rank = rank;
            $rootScope.show_me = rank;
            $rootScope.TextReview = TextReview;
            if ($rootScope.rank == undefined || $rootScope.rank == 0 || $rootScope.TextReview == "" || $rootScope.TextReview == undefined) {
                $window.alert("Must insert rank and review");
            } else {
                //add Review
                $http({
                        url: 'http://localhost:3000/users/addReview',
                        method: "POST",
                        headers: {
                            'x-auth-token': $window.localStorage.token
                        },
                        data: {
                            "PointName": $rootScope.currPoi.PointName,
                            "Rank": rank,
                            "TextReview": TextReview
                        }
                    })
                    .then(function (response) {
                        $window.alert("Thank for your review");
                        $rootScope.rank = 0;
                        $rootScope.TextReview = "";
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        }

        $rootScope.changeFav = function (poi) {
            if ($scope.checkInFav(poi)) { //in Favorites - remove from favorites
                $rootScope.removeFromFavorites(poi);
            } else //not in favorites - add to favorites
            {
                $rootScope.addToFavorites(poi);
            }
        }

        $rootScope.addToFavorites = function (poi) {
            //get interests and countries
            $http({
                    url: 'http://localhost:3000/users/AddPointOfInterestToFavorite',
                    method: "POST",
                    headers: {
                        'x-auth-token': $window.localStorage.token
                    },
                    data: {
                        "PointName": poi.PointName
                    }
                })
                .then(function (response) {
                    $rootScope.getFavorites();
                })
                .catch(function (err) {
                    console.log(err)
                })
        }

        $rootScope.removeFromFavorites = function (poi) {
            //get interests and countries
            $http({
                    url: 'http://localhost:3000/users/removePointOfInterestFromFavorite',
                    method: "DELETE",
                    headers: {
                        'x-auth-token': $window.localStorage.token
                    },
                    params: {
                        "PointName": poi.PointName
                    }
                })
                .then(function (response) {
                    $rootScope.getFavorites();
                })
                .catch(function (err) {
                    console.log(err)
                })
        }

        $rootScope.checkInFav = function (poi) {
            for (i in $rootScope.favorites) {
                var poiName = poi.PointName;
                var favName = $rootScope.favorites[i].PointName;
                if (poiName == favName) {
                    return true;
                }
            }
            return false;
        }

        $rootScope.getStyle = function (poi) {
            if ($rootScope.checkInFav(poi)) {
                return $scope.favBtn;
            }
            return $scope.noFavBtn;
        }

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

        $scope.changeInfoVisible = function () {
            $rootScope.infoVisible = false;
        }

        $rootScope.getFavorites = function () {
            $http({
                url: 'http://localhost:3000/users/getFavorites',
                method: "POST",
                headers: { 'x-auth-token': $window.localStorage.getItem('token') }
            })
                .then(function (response) {
                    console.log($rootScope.favorites);
                    $rootScope.favorites = response.data.FavPointsOfInterest;
                    console.log($rootScope.favorites);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    });