angular.module('starter.controllers')
.controller('Error', function($scope, $ionicPlatform, $state) {

    $scope.reloadRequest = function() {
        $state.go('homepage',null,{reload:true});
    };

}).controller('Maj', function($scope, $ionicPlatform, $state, Api, $ionicLoading) {

    $scope.maintenance = {};
    $ionicLoading.show();

    Api.info().then(function (response) {
        $scope.maintenance = response.data;
    }, function () {

    }).finally(function() {
        $ionicLoading.hide();
    });

    $scope.config = Config;

}).controller('Maintenance', function($scope, $ionicPlatform, $state, Api, OAuth, $ionicLoading, $location) {

    $scope.maintenance = {};

    $scope.load = function() {

        $ionicLoading.show();

        Api.info().then(function (response) {
            $scope.maintenance = response.data;

            console.log(response.data);

            if ($scope.maintenance.maintenance_game == false) {
                if (OAuth.isAuthenticated()) {
                    $location.path('/app/account');
                } else {
                    $location.path('/homepage');
                }
            }
        }, function () {

        }).finally(function() {
            $ionicLoading.hide();
        });


    };

    $scope.load();

});