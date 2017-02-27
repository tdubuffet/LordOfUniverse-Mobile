angular.module('starter.controllers')
.controller('AppTechnology', function($scope, $ionicPlatform, Build, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicPopup, $location, $rootScope) {


    $scope.doRefresh = function() {
        $scope.loadTechnology(false).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.loadTechnology = function(loading) {

        if (loading) {
            $ionicLoading.show();
        }
        return Build.technology().then(function (data) {
            $scope.technologies = data.technologies;
            $scope.buildInProgress = data.buildInProgress;
            $rootScope.$broadcast('refresh:user');

            if (loading) {
                $ionicLoading.hide();
            }
        });
    };


    $scope.loadTechnology(true);

    /**
     * Method : Add batiment
     */
    $scope.launchTechnology = function(id) {
        Build.addTechnology(id).then(function(data) {
            $scope.modal.hide().then(function() {
                if (data.status == 'nok') {

                    $ionicPopup.alert({
                        title: 'Recherche impossible',
                        template: data.message
                    });
                } else {

                    $scope.technologies = data.data.technologies;
                    $scope.buildInProgress = data.data.buildInProgress;

                    $rootScope.$broadcast('refresh:user');
                }
            })
        }, function() {

        });
    };

    $ionicModal.fromTemplateUrl('js/Pages/App/Build/technology-popup.html', {
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