angular.module("myApp")
    .controller("loginController", function ($scope, $rootScope, $http, $window, redirect) {
        self = this;

        //login function
        $scope.login = function () {
            //get username and passwd
            let username = $scope.username;
            let password = $scope.password;
            //post request
            $http({
                url: 'http://localhost:3000/users/login',
                method: "POST",
                data: { 'Username': this.username, 'Password': this.password }
            })
                .then(function (response) {
                    //if correct username and password
                    $rootScope.currUser = username;
                    $rootScope.loggedIn = true;
                    $window.localStorage.setItem('token', response.data.token);
                    $window.localStorage.setItem('username', username);
                    $rootScope.getFavorites();
                    redirect.redirect("userHome");
                    //console.log($window.localStorage.token)
                })

                .catch(function (err) {
                    alert("bad username or password");  
                    console.log(err)
                })
        }

    });