angular.module('starter.controllers')
.controller('AppAccount', function($scope, $ionicPlatform, Account, $ionicLoading, $rootScope) {


    $ionicLoading.show();
    Account.me().then(function(user) {
        $rootScope.user = user;
        $ionicLoading.hide();

        $scope.labels =["Bâtiments", "Technologies", "Population", "Vaisseaux", "Appareil"];

        $scope.data = [
            [
                (user.points_building * 100) / user.points,
                (user.points_technology * 100) / user.points,
                (user.points_population * 100) / user.points,
                0,
                (user.points_apparatus * 100) / user.points,
            ]
        ];


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

.controller('AppAccountEdit', function($scope, $rootScope, $ionicLoading, Account, $cordovaCamera, Picture) {

    $scope.formUser = {
        username: $rootScope.user.username,
        email: $rootScope.user.email,
        description: $rootScope.user.description,
        notification: $rootScope.user.notification,
        emailing: $rootScope.user.emailing,
        newsletter: $rootScope.user.newsletter
    };

    $scope.avatar = function() {
        var options = {
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            quality: 65,
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {

            $ionicLoading.show();
            Picture.sendAlly(imageData).then(function() {

                $state.reload();

            }, function() {

            }).finally(function() {
                $ionicLoading.hide();
            });

        });
    };

    $scope.save = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();

        if ($scope.formUser.notification == false) {
            delete $scope.formUser.notification;
        }

        if ($scope.formUser.emailing == false) {
            delete $scope.formUser.emailing;
        }

        if ($scope.formUser.newsletter == false) {
            delete $scope.formUser.newsletter;
        }

        Account.edit($scope.formUser).then(function(data) {
            $ionicLoading.hide();
        }, function() {

            $ionicLoading.hide();
        });

    };

})

.controller('AppProfil', function($scope, $ionicPlatform, Account, $ionicLoading, $rootScope, $stateParams, ionicToast, Ally, $ionicModal) {


    $scope.cdn = Config.cdn;

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

    $ionicModal.fromTemplateUrl('js/Pages/App/Ally/ally_recruitment.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.recruitment = function() {

        $scope.modal.show();
        $scope.recruitment = {};


        $scope.saveRecruitment = function(form) {

            if (form.$invalid) {
                return;
            }

            $ionicLoading.show();

            var id = $scope.ally.id;

            Ally.recruitment($scope.ally.id, $scope.recruitment.message).then(function(response) {
                $scope.ally = response.data;

                $ionicLoading.hide().then(function() {
                    $scope.modal.hide();
                })
            }, function() {
                $ionicLoading.hide();
            });

        };
        $scope.closeModal = function() {
            $scope.help = {};
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

    };

});