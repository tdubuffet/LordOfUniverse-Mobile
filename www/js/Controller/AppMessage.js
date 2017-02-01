angular.module('starter.controllers')
.controller('AppMessage', function($scope, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, $rootScope, $q, $location, $state, Message) {


    $ionicLoading.show();
    Message.me().then(function(data) {

        $scope.threads = data.data;

        $ionicLoading.hide();
    }, function() {
        $ionicLoading.hide();
    });
});