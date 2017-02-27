angular.module('starter.controllers')
.controller('AppPopulation', function($scope, $ionicPlatform, Build, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicPopup, $location, $rootScope) {

    $scope.loadPopulation = function(loading) {

        if (loading) {
            $ionicLoading.show();
        }
        return Build.population().then(function (data) {
            $scope.populations = data.populations;
            $scope.buildInProgress = data.buildInProgress;
            $rootScope.$broadcast('refresh:user');

            if (loading) {
                $ionicLoading.hide();
            }
        });
    };


    $scope.loadPopulation(true);


    $scope.doRefresh = function() {
        $scope.loadPopulation(false)
        .finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    /**
     * Method : Add batiment
     */
    $scope.launchPopulation = function(id) {
        $scope.data = {
            quantity: 1,
            metal: $scope.help.data.ressources.metal,
            crystal: $scope.help.data.ressources.crystal,
            lithium: $scope.help.data.ressources.lithium,

        };


        var template = ''
            + '<div class="popup-details">'
                + '<div><img class="icon" src="js/Pages/App/Build/img/icon-metal.png" /> {{ numberFormated(data.metal * data.quantity) }}</div>'
                + '<div><img class="icon" src="js/Pages/App/Build/img/icon-cristal.png" /> {{ numberFormated(data.metal * data.quantity) }}</div>'
                + '<div><img class="icon" src="js/Pages/App/Build/img/icon-lir.png" /> {{ numberFormated(data.lithium * data.quantity) }}</div>'
            + '</div>'
            + '<input type="tel" ng-model="data.quantity" placeholder="Quantité à former ?" value="1" ui-number-mask="0" />';

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: template,
            title: 'Former',
            scope: $scope,
            buttons: [
                {
                    text: 'Annuler',
                    type: 'button-assertive'
                },
                {
                    text: 'Confirmer',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.quantity) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            Build.addPopulation(id, $scope.data.quantity).then(function(data) {
                                $scope.modal.hide().then(function() {
                                    if (data.status == 'nok') {

                                        $ionicPopup.alert({
                                            title: 'Enrolement impossible',
                                            template: data.message
                                        });
                                    } else {

                                        $scope.populations = data.data.populations;
                                        $scope.buildInProgress = data.data.buildInProgress;

                                        $rootScope.$broadcast('refresh:user');
                                    }
                                })
                            }, function() {

                            });
                        }
                    }
                }
            ]
        });
    };

    $ionicModal.fromTemplateUrl('js/Pages/App/Build/population-popup.html', {
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
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });



});