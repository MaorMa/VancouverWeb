angular.module("myApp")
    .controller("forgotPasswordController", function ($scope, $http, $timeout,$location) {
        self = this;
        let questionsOk = false;

        //get questions function
        $scope.getQuestions = function () {
            //get username
            let username = $scope.username;
            //get request
            $http({
                url: 'http://localhost:3000/users/GetUserQuestions',
                method: "GET",
                params: { 'Username': this.username }
            })
                .then(function (response) {
                    $scope.questionsOk = true;
                    $scope.q1 = response.data.Questions[0].Question1;
                    $scope.q2 = response.data.Questions[0].Question2;
                })
                .catch(function (err) {
                    console.log(err.data.Error)
                })
        }

        $scope.getPsw = function() {
            $http({
                url: 'http://localhost:3000/users/RetrievePassword',
                method: "POST",
                data: { 'Username': this.username,'VerificationAnswer1':$scope.ans1,'VerificationAnswer2':$scope.ans2 }
            })
            .then(function (response) {
                $scope.psw = response.data.Password;
                $timeout(redirect, 5000);
            })
            .catch(function (err) {
                alert("Authenticaion Failure");  
                console.log(err)
            })
        }

        function redirect() {
            $location.path("login");
        }
    });