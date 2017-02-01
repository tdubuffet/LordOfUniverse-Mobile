angular.module('starter.controllers')
.controller('AppAccount', function($scope, $ionicPlatform, Account, $ionicLoading, $rootScope) {


    $ionicLoading.show();
    Account.me().then(function(user) {
        $rootScope.user = user;
        $ionicLoading.hide();
    });

    $scope.loadTabRank = function() {
        $ionicLoading.show();
        Account.level().then(function(data) {
            $scope.levels = data;

            $scope.percentage = Math.round((($rootScope.user.exp - $rootScope.user.level.exp) * 100) / ($rootScope.user.level.next.exp - $rootScope.user.level.exp));

            $ionicLoading.hide();
        });
    }

});