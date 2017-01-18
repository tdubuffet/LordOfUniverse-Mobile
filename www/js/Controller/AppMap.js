angular.module('starter.controllers')
.controller('AppMap', function($scope, $ionicPlatform, Map, $ionicLoading, $ionicSideMenuDelegate, $rootScope) {

    $rootScope.position = {
        x: 1,
        y: 1
    };



    $scope.change = function(type) {

        if (type == 'top') {
            if ($rootScope.position.y == 1) {
                return ;
            }
            $rootScope.position.y--;
        }

        if (type == 'left') {
            if ($rootScope.position.x == 1) {
                return ;
            }
            $rootScope.position.x--;
        }

        if (type == 'right') {
            $rootScope.position.x++;
        }

        if (type == 'bottom') {
            $rootScope.position.y++;
        }

        $ionicLoading.show();
        Map.get($rootScope.position).then(function(data) {
            $scope.data = data;
            $ionicLoading.hide();
        });

    };


    $ionicPlatform.ready(function() {

        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('landscape');
        }

        $ionicSideMenuDelegate.canDragContent(false)


        $ionicLoading.show();
        Map.get($rootScope.position).then(function(data) {
            $scope.data = data;
            $ionicLoading.hide();
        });


    });

});