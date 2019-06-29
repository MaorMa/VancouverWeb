angular.module("myApp")
    .controller("favoritesController", function ($scope, $filter, $rootScope, $http, $window) {
        self = this;

        $scope.sortByCategory = function () {
            //console.log("get in");
            $rootScope.favorites = $filter('orderBy')($rootScope.favorites, 'PointCategory');
            //console.log($rootScope.favorites);
        }

        $scope.sortByRank = function () {
            $rootScope.favorites = $filter('orderBy')($rootScope.favorites, 'PointRating');
            //console.log($rootScope.favorites);
        }

        $scope.goUp = function (fav) {
            let index = $rootScope.favorites.indexOf(fav);
            if (index !== 0) {
                var tmpFav = $rootScope.favorites[index - 1];
                $rootScope.favorites[index - 1] = fav;
                $rootScope.favorites[index] = tmpFav;
            }
        }

        $scope.goDown = function (fav) {
            let index = $rootScope.favorites.indexOf(fav);
            if (index !== $rootScope.favorites.length - 1) {
                var tmpFav = $rootScope.favorites[index + 1];
                $rootScope.favorites[index + 1] = fav;
                $rootScope.favorites[index] = tmpFav;
            }
        }

        $scope.saveFavOrder = function () {
            delAllFavs();
        }

        function delAllFavs() {
            var amountOfFavs = 0;
            for (x in $rootScope.favorites) {
                $http({
                        url: 'http://localhost:3000/users/removePointOfInterestFromFavorite',
                        method: "DELETE",
                        headers: {
                            'x-auth-token': $window.localStorage.token
                        },
                        params: {
                            "PointName": $rootScope.favorites[x].PointName
                        }
                    })
                    .then(function (response) {
                        amountOfFavs += 1;
                        if (amountOfFavs == $rootScope.favorites.length)
                            saveAllFavs();
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        }

        function saveAllFavs() {
            saveAllFavsIndex(0);
            alert("Favorites order saved!");
        }

        function saveAllFavsIndex(index) {
            $http({
                    url: 'http://localhost:3000/users/AddPointOfInterestToFavorite',
                    method: "POST",
                    headers: {
                        'x-auth-token': $window.localStorage.token
                    },
                    data: {
                        "PointName": $rootScope.favorites[index].PointName
                    }
                })
                .then(function (response) {
                    var newIndex = index + 1;
                    if (newIndex == $rootScope.favorites.length) {
                        $rootScope.getFavorites();
                        //$rootScope.favorites = $filter('orderBy')($rootScope.favorites, 'TimeSaving');
                    }
                    else{
                        saveAllFavsIndex(newIndex);
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
    });