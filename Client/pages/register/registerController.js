angular.module("myApp")
    .controller("registerController", function ($scope, $http, redirect) {
        self = this;
        $scope.countries = ['Australia', 'Bolivia', 'China', 'Denemark', 'Israel', 'Latvia',
            'Monaco', 'August', 'Norway', 'Panama', 'Switzerland', 'USA'
        ];

        $scope.init = function () {
            //get interests and countries
            $http({
                    url: 'http://localhost:3000/poi/getCategories',
                    method: "GET"
                })
                .then(function (response) {
                    $scope.interests = response.data.Category;
                })
                .catch(function (err) {
                    console.log(err)
                })
                .then(function () {
                    $http({
                            url: 'http://localhost:3000/users/GetQuestions',
                            method: "GET"
                        })
                        .then(function (response) {
                            $scope.Questions = response.data.Questions;

                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                })
        }

        $scope.register = function () {
            if ($scope.q1.Question == $scope.q2.Question) {
                alert("You can't select the same question");
            } else if ($scope.interest1 == $scope.interest2) {
                alert("Please select different Interests");
            } else {
                $http({
                        url: 'http://localhost:3000/users/register',
                        method: "POST",
                        data: {
                            'FirstName': $scope.fname,
                            'LastName': $scope.lname,
                            'City': $scope.city,
                            'Country': $scope.selectedCountry,
                            'Email': $scope.email,
                            'Username': $scope.uname,
                            'Password': $scope.psw,
                            'q1': $scope.q1.Question,
                            'q2': $scope.q2.Question,
                            'VerificationAnswer1': $scope.verifictionAnswer1,
                            'VerificationAnswer2': $scope.verifictionAnswer2,
                            'InterestSubjects': [$scope.interest1, $scope.interest2]
                        }
                    })
                    .then(function (response) {
                        alert("User created! Please log in...");
                        redirect.redirect("login");
                    })
                    .catch(function (err) {
                        //console.log($scope.interest1);
                        //console.log($scope.interest2);
                        alert("One of the fields is incorrect");
                        //console.log(err)
                    })
            }

        }
    });