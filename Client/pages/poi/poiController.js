angular.module("myApp")
    .controller("poiController", function ($scope, $http, $window, $rootScope, $filter) {
        self = this;
        $scope.categories = [];
        $scope.All = [];
        $scope.pointsToShow = [];
        $scope.results = false;
        $scope.selectedCategory = 'All';

        $scope.OpenPopupWindow = function () {
            var $popup = $window.open("popup", "width=250,height=100,left=10,top=150");
            $popup.Name = $scope.Name;
        }

        $scope.getAllCategories = function () {
            //get interests and countries
            $http({
                    url: 'http://localhost:3000/poi/getCategories',
                    method: "GET",
                })
                .then(function (response) {
                    $scope.categories = response.data.Category;
                    $scope.getAllPoints($scope.categories);
                    $scope.categories.push('All');
                    this.selectedCategory = 'All';
                })
                .catch(function (err) {
                    console.log(err)
                })
        }

        $scope.getAllPoints = function (categories) {
            angular.forEach(categories, function (value, key) {
                //get interests and countries
                $http({
                        url: 'http://localhost:3000/poi/getPointsByCategory',
                        method: "GET",
                        params: {
                            'Category': value
                        }
                    })
                    .then(function (response) {
                        $scope.tmpAll = response.data.PointsOfInterest;
                        angular.forEach($scope.tmpAll, function (value, key) {
                            $scope.All.push(value);
                            $scope.pointsToShow.push(value);
                        });
                        $scope.results = true;
                        $scope.sortByCategory();
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            });
        }

        $scope.sortByCategory = function () {
            $scope.pointsToShow = $filter('orderBy')($scope.pointsToShow, 'PointCategory');
        }



        $scope.getPartName = function () {
            $rootScope.infoVisible = false;
            this.selectedCategory = 'All';
            if (this.searcValue == "") {
                $scope.pointsToShow = $scope.All;
            } else {
                $scope.pointsToShow = [];
                for (x in $scope.All) {
                    var poi = (String($scope.All[x].PointName));
                    var search = (this.searcValue);
                    if ((poi.toLowerCase()).includes(search.toLowerCase())) {
                        this.pointsToShow.push($scope.All[x]);
                    }
                }
            }
            showResults();
        }

        $scope.filterByCategory = function () {
            $rootScope.infoVisible = false;
            this.searcValue = "";
            if (this.selectedCategory == 'All') {
                $scope.results = true;
                $scope.pointsToShow = $scope.All;
            } else {
                $http({
                        url: 'http://localhost:3000/poi/getPointsByCategory',
                        method: "GET",
                        params: {
                            'Category': this.selectedCategory
                        }
                    })
                    .then(function (response) {
                        $scope.pointsToShow = response.data.PointsOfInterest;
                        $scope.results = true;
                    })
                    .catch(function (err) {
                        console.log(err)
                        $scope.results = false;
                    })
            }
            showResults();
        }

        function showResults() {
            if ($scope.pointsToShow.length > 0)
                $scope.results = true;
            else
                $scope.results = false;
        }

        $scope.sortByRank = function () {
            $scope.pointsToShow = $filter('orderBy')($scope.pointsToShow, 'PointRating');
        }
    });