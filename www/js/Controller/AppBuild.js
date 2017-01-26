angular.module('starter.controllers')
.controller('AppBuilding', function($scope, $ionicPlatform, Build, $ionicLoading, $ionicModal) {


    $scope.tab = 1;

    $ionicLoading.show();
    Build.building().then(function(building) {
        $scope.building = building;
        $ionicLoading.hide();
    });

    $scope.tabChange = function(tab){
        $scope.tab = tab;

        return true;
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