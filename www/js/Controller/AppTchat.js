angular.module('starter.controllers')
.controller('AppTchat', function($scope, $ionicPlatform, $ionicScrollDelegate, $ionicLoading, $location, Tchat, $q, Account) {



    var loadMessage = function(ionicLoading) {

        var q = $q.defer();

        if (ionicLoading) {
            $ionicLoading.show();
        }
        Tchat.getLast().then(function (data) {

            $scope.messages = data;

            if (ionicLoading) {
                $ionicLoading.hide().then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicScrollDelegate.scrollBottom(true);
                });
            } else {
                $scope.$broadcast('scroll.refreshComplete');
                $ionicScrollDelegate.scrollBottom(true);
            }

            q.resolve('ok');
        }, function() {
            q.reject('nok');
        });

        setTimeout(function() {
            if ($location.path() == '/app/tchat') {
                loadMessage(false);
            }
        }, 8000);

        return q.promise;
    };

    var promiseMessage = loadMessage(false);
    var promiseUser = Account.me(function(user) {
        $scope.user = user;
    });

    $ionicLoading.show();

    $q.all([
        promiseMessage,
        promiseUser
    ]).then(function() {
        $ionicLoading.hide().then(function () {
            $scope.$broadcast('scroll.refreshComplete');
            $ionicScrollDelegate.scrollBottom(true);
        });
    });

    $scope.input = {};

    $scope.sendMessage = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();

        Tchat.add($scope.input.message).then(function(data) {

            $scope.messages     = data;
            $scope.input        = {};

            $ionicLoading.hide().then(function() {
                $scope.$broadcast('scroll.refreshComplete');
                $ionicScrollDelegate.scrollBottom(true);
            });
        })
    };


});