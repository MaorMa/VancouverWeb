var app = angular.module('myApp', ["ngRoute"]);

// config routes
app.config(function ($routeProvider) {
    $routeProvider
        //homepage
        .when('/', {
            // this is a template url
            templateUrl: 'pages/home/home.html',
            controller: 'homeController as homeCtrl'
        })

        .when('/userHome', {
            // this is a template url
            templateUrl: 'pages/home/userHome.html',
            controller: 'userHomeController as userHomeCtrl'
        })

        //register
        .when('/register', {
            // this is a template url
            templateUrl: 'pages/register/register.html',
            controller: 'registerController as regCtrl'
        })

        // login
        .when('/login', {
            // this is a template url
            templateUrl: 'pages/login/login.html',
            controller: 'loginController as lgCtrl'
        })

        // favorites
        .when('/favorites', {
            templateUrl: 'pages/favorites/favorites.html',
            controller: 'favoritesController as favCtrl'
        })

        // forgot password
        .when('/forgotPassword', {
            templateUrl: 'pages/login/forgotPassword.html',
            controller: 'forgotPasswordController as forgCtrl'
        })
        
        .when('/poi', {
            templateUrl: 'pages/poi/poi.html',
            controller: 'poiController as poiCtrl'
        })

        .when('/about', {
            templateUrl: 'pages/about/about.html',
            controller: 'aboutController as aboutCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
});


