angular.module('starter.controllers')
.controller('HomePage', function($scope, $ionicPlatform, Api, Account, OAuth, $location) {


    if (OAuth.isAuthenticated()) {
        $location.path('/app/account');
    }


    $scope.login = {};

    $scope.doLogin = function(form) {
        if (form.$invalid) {
            return;
        }

        OAuth.getAccessToken($scope.login).then(function(success) {
            $location.path('/app/home');
        }, function(error) {
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



            });
        });
    };

})
.controller('Register', function($scope, $ionicPlatform, Account, $ionicLoading) {


    $scope.registration = {};

    $scope.doRegister = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();


        Account.create($scope.registration).then(function(data) {



        }, function(data) {
            console.log(data);
        }).finally(function() {
            $ionicLoading.hide();
        });

    };


})
.controller('Password', function($scope, $ionicPlatform) {



});