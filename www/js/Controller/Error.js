angular.module('starter.controllers')
.controller('Error', function($scope, $ionicPlatform, $state) {
    
    $scope.reloadRequest = function() {
        $state.go('homepage',null,{reload:true});
    };
    
});