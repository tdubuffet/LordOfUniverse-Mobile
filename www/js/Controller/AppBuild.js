angular.module('starter.controllers')
.controller('AppBuilding', function($scope, $ionicPlatform, Build, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicPopup, $location, $rootScope, $window) {

    $scope.buildInProgress = {};
    $scope.defaultBuild = [1, 3, 4, 6, 11, 12, 13];

    $scope.isDefaultBuild = function(id) {

        if ($scope.defaultBuild.indexOf(id) !== -1) {
            return true;
        }
        return false;
    }

    $scope.emplacement = false;
    $scope.showEmplacement = function() {
        if ($scope.emplacement == false) {
            $scope.emplacement = true;
        } else {
            $scope.emplacement = false;
        }
        setTimeout(function() {
            $scope.emplacement = false;
        }, 15000);

    };

    $ionicPlatform.ready(function() {
        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('landscape');
        }

    });

    var reloadScope = function () {

        $scope.$applyAsync();
        console.info('Building Reload Scope');
        setTimeout(function() {
            if ($location.path() == '/app/building') {
                reloadScope();
            }
        }, 1000);
    };
    setTimeout(function() {
        reloadScope();
    }, 1000);


    $ionicLoading.show();
    Build.building().then(function(data) {
        $scope.building = data.buildings;
        console.log(data.buildings);
        $scope.buildInProgress = data.buildInProgress;
        $scope.builders = data.builders;
        $ionicLoading.hide();
    });

    var reloadBuilding = function() {
        setTimeout(function () {
            Build.building().then(function (data) {
                $scope.building = data.buildings;
                $scope.buildInProgress = data.buildInProgress;
                $scope.builders = data.builders;

                $rootScope.$broadcast('refresh:user');
            });

            if ($location.path() == '/app/building') {
                reloadBuilding();
            }
        }, 30000);
    };
    reloadBuilding();

    $scope.vscroll = function(direction){
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
    };


    /**
     * Method : Add batiment
     */
    $scope.launchBatiment = function(id) {
        Build.add(id).then(function(data) {
            $scope.modalBuild.hide().then(function() {
                if (data.status == 'nok') {

                    $ionicPopup.alert({
                        title: 'Construction impossible',
                        template: data.message
                    });
                } else {
                    $rootScope.$broadcast('refresh:user');
                }
            })
        }, function() {

        });
    };

    $ionicModal.fromTemplateUrl('js/Pages/App/Build/building-builder.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalBuilder = modal;
    });
    $scope.builder = function() {
        $scope.modalBuilder.show();
    };
    $scope.closeModal = function() {
        $scope.modalBuilder.hide();
    };

    /**
     * POPIN
     * @type {null}
     */
    $scope.popInBat = null;
    $scope.popInBatOpen = function(id) {
        if ($scope.popInBat == id) {
            return ;
        }
        $scope.popInBat = id;
        $scope.popInBatValue = true;
    };

    $scope.popInBatClose = function() {

        $scope.popInBat = null;
        $scope.popInBatValue = false;
    };

    $ionicModal.fromTemplateUrl('js/Pages/App/Build/building-popup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.showInformation = function(data) {
        $scope.help = data;
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.help = {};
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
        $scope.modalBuild.remove();
        $scope.modalBuilder.remove();
    });


    $ionicModal.fromTemplateUrl('js/Pages/App/Build/building-popup-build.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalBuild = modal;
    });
    $scope.showBuild = function(data) {
        $scope.help = data;
        $scope.modalBuild.show();
    };
    $scope.closeModalBuild = function() {
        $scope.help = {};
        $scope.modalBuild.hide();
    };

    $ionicModal.fromTemplateUrl('js/Pages/App/Build/building-build-in-progress.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalBip = modal;
    });
    $scope.showBip = function(data) {
        $scope.modalBip.show();
    };
    $scope.closeModalBip = function() {
        $scope.modalBip.hide();
    };


    //CLOSE
    document.addEventListener("deviceready", onDeviceReady, false);

    $scope.close = function() {
        if (parseInt($window.history.length) <= 2) {
            navigator.app.exitApp();
        } else {

            $scope.data = {};

            if (typeof screen.unlockOrientation === "function") {
                screen.unlockOrientation();
                screen.lockOrientation('portrait');
            }

            $ionicSideMenuDelegate.canDragContent(true);
            $window.history.back();
        }
    };

    function onDeviceReady() {
        document.addEventListener("backbutton", function (e) {
            $scope.close();
        }, false);


    };


});