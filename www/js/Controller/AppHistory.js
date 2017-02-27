angular.module('starter.controllers')
.controller('AppHistory', function($scope, $ionicPlatform, $state) {

    $scope.button = false;

    setTimeout(function() {
        $scope.button = true;
    }, 8000);

    $ionicPlatform.ready(function() {
        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('landscape');
        }
    });


    $scope.goToHome = function() {
        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('portrait');
        }

        $state.go('app.home');
    }
    

});