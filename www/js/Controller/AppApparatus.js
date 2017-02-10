angular.module('starter.controllers')
    .controller('AppApparatus', function($scope, $ionicPlatform, Build, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicPopup, $location, $rootScope) {

        $scope.loadApparatus = function(loading) {

            if (loading) {
                $ionicLoading.show();
            }
            Build.apparatus().then(function (data) {
                $scope.apparatus = data.apparatus;
                $scope.buildInProgress = data.buildInProgress;
                $rootScope.$broadcast('refresh:user');

                if (loading) {
                    $ionicLoading.hide();
                }

                if ($location.path() == '/app/apparatus') {

                    setTimeout(function () {
                        $scope.loadApparatus(false);
                    }, 30000);
                }
            });
        };


        $scope.loadApparatus(true);

        var reloadScope = function () {

            $scope.$applyAsync();
            console.info('Apparatus Reload Scope');
            setTimeout(function() {
                if ($location.path() == '/app/apparatus') {
                    reloadScope();
                }
            }, 1000);
        };
        setTimeout(function() {
            reloadScope();
        }, 1000);

        /**
         * Method : Add batiment
         */
        $scope.launchApparatus = function(id) {

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
                            if (!$scope.data.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });

            //Build.addApparatus(id).then(function(data) {
            //    $scope.modal.hide().then(function() {
            //        if (data.status == 'nok') {
//
            //            $ionicPopup.alert({
            //                title: 'Recherche impossible',
            //                template: data.message
            //            });
            //        } else {
//
            //            $scope.apparatus = data.data.apparatus;
            //            $scope.buildInProgress = data.data.buildInProgress;
//
            //            $rootScope.$broadcast('refresh:user');
            //        }
            //    })
            //}, function() {
//
            //});
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