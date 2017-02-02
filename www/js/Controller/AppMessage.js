angular.module('starter.controllers')
.controller('AppMessage', function($scope, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, $rootScope, $q, $location, $state, Message) {


    $scope.loadMessagePlayers = function() {
        $ionicLoading.show();
        Message.me().then(function(response) {
            $scope.players = response.data;
            $ionicLoading.hide();
        }, function() {
            $ionicLoading.hide();
        });
    };

    $scope.loadMessageSpy = function() {
        $ionicLoading.show();
        Message.spy().then(function(response) {
            $scope.spies = response.data;
            $ionicLoading.hide();
        }, function() {
            $ionicLoading.hide();
        });
    };

    $scope.loadMessageReport = function() {
        $ionicLoading.show();
        Message.report().then(function(response) {
            $scope.reports = response.data;
            $ionicLoading.hide();
        }, function() {
            $ionicLoading.hide();
        });
    };

    $scope.loadMessageSystem = function() {
        $ionicLoading.show();
        Message.system().then(function(response) {
            $scope.systems = response.data;
            $ionicLoading.hide();
        }, function() {
            $ionicLoading.hide();
        });
    };

})
.controller('AppThread', function($scope, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, $rootScope, $q, $location, $stateParams, Message) {

    $ionicLoading.show();

    Message.thread($stateParams.threadId).then(function(response) {

        $scope.thread = response.data;
        $scope.$broadcast('scroll.refreshComplete');
        $ionicScrollDelegate.scrollBottom(true);
        $ionicLoading.hide();
    }, function() {
        $ionicLoading.hide();
    });

    $scope.input = {};

    $scope.sendMessage = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();

        Message.add($scope.thread.id, $scope.input.message).then(function(response) {

            $scope.thread     = response.data;
            $scope.input        = {};

            $ionicLoading.hide().then(function() {
                $scope.$broadcast('scroll.refreshComplete');
                $ionicScrollDelegate.scrollBottom(true);
            });
        })
    };

});