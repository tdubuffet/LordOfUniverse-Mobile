angular.module('starter.controllers')
.controller('AppBuilding', function($scope, $ionicPlatform, Build, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicPopup, $location) {

    $ionicPlatform.ready(function() {
        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('landscape');
        }

    });

    $ionicLoading.show();
    Build.building().then(function(data) {
        $scope.building = data.buildings;
        $ionicLoading.hide();
    });

    var reloadBuilding = function() {
        setTimeout(function () {
            Build.building().then(function (data) {
                $scope.building = data.buildings;
            });

            if ($location.path() == '/app/building') {
                reloadBuilding();
            }
        }, 10000);
    };
    reloadBuilding();

    $scope.vscroll = function(direction){
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
    };

    $scope.timer = function(value) {
        var startTimeStamp = new Date(value.start).getTime();
        var endTimeStamp = new Date(value.end).getTime();
        var current = new Date().getTime();
        var percent = 100 - (((endTimeStamp - current) * 100) / (endTimeStamp - startTimeStamp));
        return percent.toFixed(2);
    };

    $scope.currentTimeoutReload = function() {
        $scope.currentTimeout = new Date().getTime();
        setTimeout(function() {
            $scope.currentTimeoutReload();
        }, 1000)

        return $scope.currentTimeout;
    };

    $scope.timerAff = function(value) {
        var startTimeStamp = new Date(value.start).getTime();
        var endTimeStamp = new Date(value.end).getTime();
        var current = $scope.currentTimeoutReload();

        var time = (endTimeStamp - current) / 1000;

        var texte = "";
        var day = Math.floor(time / 86400);
        var hour = Math.floor((time - day * 86400) / 3600);
        var min = Math.floor((time - day * 86400 - hour * 3600) / 60);
        var sec = time - day * 86400 - hour * 3600 - min * 60;
        if (time < 600) {
            sec = Math.round(sec, 2);
        }
        else
            sec = Math.round(sec);

        if (sec < 10)
            sec = "0" + sec;
        texte = sec + "s";

        if (min > 0) {
            if (min < 10)
                min = "0" + min;
            texte = min + "m " + texte;
        }
        if (hour > 0) {
            if (hour < 10)
                hour = "0" + hour;
            texte = hour + "h " + texte;
        }
        if (day > 0) {
            if (day < 10)
                day = "0" + day;
            texte = day + "j " + texte;
        }


        return texte;
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
                }
            })
        }, function() {

        });
    };

    /**
     * POPIN
     * @type {null}
     */
    $scope.popInBat = null;
    $scope.popInBatOpen = function(id) {
        $scope.popInBat = id;
        $scope.popInBatValue = true;
    };
    $scope.popInBatClose = function() {
        $scope.popInBat = null;
        $scope.popInBatValue = false;

        console.log($scope.popInBat);
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


});