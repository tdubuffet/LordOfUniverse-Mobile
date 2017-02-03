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

    $scope.loadFriends = function () {


        $ionicLoading.show();
        Account.friends().then(function(data) {
            $scope.friends = data;
            $ionicLoading.hide();
        });

    };

})

.controller('AppProfil', function($scope, $ionicPlatform, Account, $ionicLoading, $rootScope, $stateParams, ionicToast, Ally) {


    $ionicLoading.show();
    $scope.profil = false;
    Account.profil($stateParams.id).then(function(user) {
        $scope.profil = user;
        $ionicLoading.hide();
    });

    $scope.addFriend = function(id) {
        Account.addFriend(id).then(function(data) {
            $scope.profil = data;
            ionicToast.show('Ajouté à vos amis.', 'bottom',false, 5000);
        }, function() {
            ionicToast.show('Error: Merci de contacter un administrateur', 'bottom',false, 5000);
        });
    };

    $scope.removeFriend = function(id) {
        Account.removeFriend(id).then(function(data) {
            $scope.profil = data;
            ionicToast.show('Retiré de vos amis.', 'bottom',false, 5000);
        }, function() {
            ionicToast.show('Error: Merci de contacter un administrateur', 'bottom',false, 5000);
        });
    };

    $scope.loadTabRank = function() {
    };

    $scope.ally = false;
    $scope.loadAlly = function() {
        console.log(Ally);
        Ally.visitor($scope.profil.ally.id).then(function(response) {
            $scope.ally = response.data;
        }, function() {

        });
    };


    $scope.friends = false;
    $scope.loadFriends = function () {


        $ionicLoading.show();
        Account.profilFriends($stateParams.id).then(function(data) {
            $scope.friends = data;
            $ionicLoading.hide();
        });

    };

});