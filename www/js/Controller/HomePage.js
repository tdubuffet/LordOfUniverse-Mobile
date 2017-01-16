angular.module('starter.controllers')
.controller('HomePage', function($scope, $ionicPlatform, Api, Account, OAuth, $location) {


    $scope.login = {};

    if (OAuth.isAuthenticated()) {
        $location.path('/app/home');
    }

    $scope.doLogin = function(form) {
        if (form.$invalid) {
            return;
        }

        OAuth.getAccessToken($scope.login).then(function(success) {
            $location.path('/app/home');
        }, function(error) {
            console.log(error);
        });
    };

    $scope.facebookLogin = function() {

        $ionicPlatform.ready(function() {
            facebookConnectPlugin.login(['public_profile', 'email'], function(success) {

                if (success.status == "connected") {


                    var accessToken = success.authResponse.accessToken;
                    var userID = success.authResponse.userID;

                    Account.facebookConnect(accessToken, userID);
                }


            }, function(error) {

                console.log(error);

            });
        });
    };

})
.controller('Register', function($scope, $ionicPlatform) {


    $scope.registration = {};

    $scope.doRegister = function(form) {

        if (form.$invalid) {
            return;
        }

        console.log($scope.registration);
    };


})
.controller('Password', function($scope, $ionicPlatform) {



});