angular.module('starter.controllers')
.controller('AppAccount', function($scope, $ionicPlatform, Account) {

    Account.me().then(function(user) {
        $scope.user = user;
    });

});