angular.module('starter.controllers')
.controller('AppAlly', function($scope, $ionicPlatform, Ally, $ionicLoading, Tchat, $ionicScrollDelegate, Account,  $rootScope, $q, $location, $state) {

    $ionicLoading.show();
    Ally.me().then(function(data) {
        $scope.ally = data;

        $scope.formAlly = {
            name: $scope.ally.name,
            tag: $scope.ally.tag,
            description: $scope.ally.description,
            recruitment: $scope.ally.recruitment
        };

        $ionicLoading.hide();
    }, function() {
        $ionicLoading.hide();
    });

    var reloadMessageTchat = false;

    $scope.removeReloadCommunication = function() {

        reloadMessageTchat = false;
    };

    $scope.loadCommunication = function() {

        reloadMessageTchat = true;

        var loadMessage = function(ionicLoading) {

            var q = $q.defer();

            if (ionicLoading) {
                $ionicLoading.show();
            }
            Tchat.getLast($scope.ally.id).then(function (data) {

                $scope.messages = data;

                if (ionicLoading) {
                    $ionicLoading.hide().then(function () {
                        $ionicScrollDelegate.scrollBottom(true);
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                } else {
                    $ionicScrollDelegate.scrollBottom(true);
                    $scope.$broadcast('scroll.refreshComplete');
                }

                q.resolve('ok');
            }, function() {
                q.reject('nok');
            });

            setTimeout(function() {
                if (reloadMessageTchat == true && $location.path() == "/app/ally") {
                    loadMessage(false);
                }
            }, 8000);

            return q.promise;
        };

        var promiseMessage = loadMessage(false);
        var promiseUser = Account.me(function(user) {
            $rootScope.user = user;
        });

        $ionicLoading.show();

        $q.all([
            promiseMessage,
            promiseUser
        ]).then(function() {
            $ionicLoading.hide().then(function () {
                $ionicScrollDelegate.scrollBottom(true);
                $scope.$broadcast('scroll.refreshComplete');
            });
        });

        $scope.input = {};

        $scope.sendMessage = function(form) {

            if (form.$invalid) {
                return;
            }

            $ionicLoading.show();

            Tchat.add($scope.input.message, $scope.ally.id).then(function(data) {

                $scope.messages     = data;
                $scope.input        = {};

                $ionicLoading.hide().then(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicScrollDelegate.scrollBottom(true);
                });
            })
        };

    };


    $scope.saveAlly = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();

        if ($scope.formAlly.recruitment == false) {
            delete $scope.formAlly.recruitment;
        }

        Ally.editGeneral($scope.formAlly).then(function(data) {
            $ionicLoading.hide();
            $state.reload();
        }, function() {

            $ionicLoading.hide();
        });

    };



})
.controller('AppAllyVisitor', function($scope, $ionicPlatform, Ally, $ionicLoading, $ionicScrollDelegate,  $rootScope, $q, $location, $state) {



});