angular.module('starter.controllers')
.controller('AppMessage', function($scope, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, $rootScope, $q, $location, $state, Message) {


    $scope.doRefresh = function(type) {

        if (type == 'players') {
            $scope.loadMessagePlayers(false)
                .finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        if (type == 'spies') {
            $scope.loadMessageSpy(false)
                .finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        if (type == 'reports') {
            $scope.loadMessageReport(false)
                .finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        if (type == 'systems') {
            $scope.loadMessageSystem(false)
                .finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }


    };

    $scope.loadMessagePlayers = function(loader) {

        if (loader) {
            $ionicLoading.show();
        }

        return Message.me().then(function(response) {
            $scope.players = response.data;

            if (loader) {
                $ionicLoading.hide();
            }
        }, function() {

            if (loader) {
                $ionicLoading.hide();
            }
        });
    };

    $scope.loadMessageSpy = function(loader) {

        if (loader) {
            $ionicLoading.show();
        }

        return Message.spy().then(function(response) {
            $scope.spies = response.data;

            if (loader) {
                $ionicLoading.hide();
            }
        }, function() {

            if (loader) {
                $ionicLoading.hide();
            }
        });
    };

    $scope.loadMessageReport = function(loader) {

        if (loader) {
            $ionicLoading.show();
        }

        return Message.report().then(function(response) {
            $scope.reports = response.data;

            if (loader) {
                $ionicLoading.hide();
            }
        }, function() {

            if (loader) {
                $ionicLoading.hide();
            }
        });
    };

    $scope.loadMessageSystem = function(loader) {

        if (loader) {
            $ionicLoading.show();
        }

        return Message.system().then(function(response) {
            $scope.systems = response.data;

            if (loader) {
                $ionicLoading.hide();
            }
        }, function() {

            if (loader) {
                $ionicLoading.hide();
            }
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

})


.controller('AppSend', function($scope, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, $rootScope, $q, $location, $stateParams, Message, ionicToast) {

    $scope.thread = {
        user: $stateParams.id
    };

    $scope.saveMessage = function(form) {

        if (form.$invalid) {
            return;
        }
        $ionicLoading.show();

        Message.send($scope.thread).then(function() {
            $ionicLoading.hide();
            $rootScope.goBack();
            ionicToast.show('Message envoyé.', 'bottom',false, 5000);
        }, function() {
            ionicToast.show('Impossible d\'envoyer le message.', 'bottom',false, 5000);
            $ionicLoading.hide();
        });

    };
});