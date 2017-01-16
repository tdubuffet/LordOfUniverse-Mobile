angular.module('starter.controllers')
.controller('AppHome', function($scope, $ionicPlatform, Account) {

    Account.me().then(function(user) {
        $scope.user = user;
    });


});