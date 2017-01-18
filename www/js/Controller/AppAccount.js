angular.module('starter.controllers')
.controller('AppAccount', function($scope, $ionicPlatform, Account, $ionicLoading) {


    $ionicLoading.show();
    Account.me().then(function(user) {
        $scope.user = user;
        $ionicLoading.hide();
    });

});