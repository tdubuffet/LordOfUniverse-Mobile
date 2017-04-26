angular.module('starter.controllers')
    .controller('AppApparatus', function($scope, $ionicPlatform, Build, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicPopup, $location, $rootScope) {

        $scope.doRefresh = function() {
            $scope.loadApparatus(false).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.loadApparatus = function(loading) {

            if (loading) {
                $ionicLoading.show();
            }
            return Build.apparatus().then(function (data) {
                $scope.apparatus = data.apparatus;
                $scope.buildInProgress = data.buildInProgress;
                $rootScope.$broadcast('refresh:user');

                if (loading) {
                    $ionicLoading.hide();
                }
            });
        };


        $scope.loadApparatus(true);


        /**
         * Method : Add batiment
         */
        $scope.launchApparatus = function(id) {

            $scope.data = {
                quantity: 0
            };
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="number" ng-model="data.quantity" placeholder="Quantité à construire ?">',
                title: 'Construire',
                scope: $scope,
                buttons: [
                    {
                        text: 'Annuler',
                        type: 'button-assertive'
                    },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.quantity) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                $ionicLoading.show();
                                Build.addApparatus(id, $scope.data.quantity).then(function(data) {
                                    $scope.modal.hide().then(function() {
                                        if (data.status == 'nok') {

                                            $ionicPopup.alert({
                                                title: 'Construction impossible',
                                                template: data.message
                                            });
                                            $ionicLoading.hide();
                                        } else {

                                            $scope.apparatus = data.data.apparatus;
                                            $scope.buildInProgress = data.data.buildInProgress;

                                            $rootScope.$broadcast('refresh:user');
                                            $ionicLoading.hide();
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

        $ionicModal.fromTemplateUrl('js/Pages/App/Build/apparatus-popup.html', {
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