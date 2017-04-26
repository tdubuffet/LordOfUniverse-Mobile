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

.controller('AppAccountEdit', function($scope, $rootScope, $ionicLoading, Account) {

    $scope.formUser = {
        username: $rootScope.user.username,
        email: $rootScope.user.email,
        description: $rootScope.user.description,
        notification: $rootScope.user.notification,
        emailing: $rootScope.user.emailing,
        newsletter: $rootScope.user.newsletter
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
angular.module('starter.controllers')
.controller('AppAlly', function($scope, $ionicPlatform, Ally, $ionicLoading, Tchat, $ionicScrollDelegate, Account,  $rootScope, $q, $location, $state, $ionicPopup) {

    $ionicLoading.show();
    $scope.ally = null;

    Ally.me().then(function(data) {
        $scope.ally = data;

        $scope.formAlly = {
            name: $scope.ally.name,
            tag: $scope.ally.tag,
            description: $scope.ally.description,
            recruitment: $scope.ally.recruitment
        };

        $ionicLoading.hide();
    }, function() {
        $ionicLoading.hide();
    });

    var reloadMessageTchat = false;

    $scope.removeReloadCommunication = function() {

        reloadMessageTchat = false;
    };

    $scope.loadCommunication = function() {

        reloadMessageTchat = true;

        var loadMessage = function(ionicLoading) {

            var q = $q.defer();

            if (ionicLoading) {
                $ionicLoading.show();
            }
            Tchat.getLast($scope.ally.id).then(function (data) {

                $scope.messages = data;

                if (ionicLoading) {
                    $ionicLoading.hide().then(function () {
                        $ionicScrollDelegate.scrollBottom(true);
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                } else {
                    $ionicScrollDelegate.scrollBottom(true);
                    $scope.$broadcast('scroll.refreshComplete');
                }

                q.resolve('ok');
            }, function() {
                q.reject('nok');
            });

            setTimeout(function() {
                if (reloadMessageTchat == true && $location.path() == "/app/ally") {
                    loadMessage(false);
                }
            }, 8000);

            return q.promise;
        };

        var promiseMessage = loadMessage(false);
        var promiseUser = Account.me(function(user) {
            $rootScope.user = user;
        });

        $ionicLoading.show();

        $q.all([
            promiseMessage,
            promiseUser
        ]).then(function() {
            $ionicLoading.hide().then(function () {
                $ionicScrollDelegate.scrollBottom(true);
                $scope.$broadcast('scroll.refreshComplete');
            });
        });

        $scope.input = {};

        $scope.sendMessage = function(form) {

            if (form.$invalid) {
                return;
            }

            $ionicLoading.show();

            Tchat.add($scope.input.message, $scope.ally.id).then(function(data) {

                $scope.messages     = data;
                $scope.input        = {};

                $ionicLoading.hide().then(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicScrollDelegate.scrollBottom(true);
                });
            })
        };

    };

    $scope.validationRecruitment = function(id, validated) {

        $ionicLoading.show();
        Ally.recruitmentValidation(id, validated).then(function(response) {

            $scope.ally = response.data;

            $ionicLoading.hide();
        }, function() {

        })

    };


    $scope.saveAlly = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();

        if ($scope.formAlly.recruitment == false) {
            delete $scope.formAlly.recruitment;
        }

        Ally.editGeneral($scope.formAlly).then(function(data) {
            $ionicLoading.hide();
            $state.reload();
        }, function() {

            $ionicLoading.hide();
        });

    };

    $scope.exit = function() {

        var popup = $ionicPopup.confirm({
            title:          'Quitter mon alliance !',
            template:       'Confirmez-vous quitter votre alliance ?',
            cancelText:     'Annuler',
            cancelType:     'button-positive',
            okText:         'Confirmer',
            okType:         'button-assertive',
        });

        popup.then(function(res) {
            if(res) {
                Ally.exit().then(function() {
                    $state.go($state.current, {}, {reload: true});
                }, function() {

                });
            }
        });

    };



})
.controller('AppAllyVisitor', function($scope, $ionicPlatform, Ally, $ionicLoading, $ionicScrollDelegate,  $rootScope, $q, $location, $state) {



});
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
                                Build.addApparatus(id, $scope.data.quantity).then(function(data) {
                                    $scope.modal.hide().then(function() {
                                        if (data.status == 'nok') {

                                            $ionicPopup.alert({
                                                title: 'Construction impossible',
                                                template: data.message
                                            });
                                        } else {

                                            $scope.apparatus = data.data.apparatus;
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
angular.module('starter.controllers')
.controller('AppBuilding', function($scope, $ionicPlatform, Build, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicPopup, $location, $rootScope, $window, $ionicSideMenuDelegate) {

    $scope.buildInProgress = {};
    $scope.defaultBuild = [1, 3, 4, 6, 11, 12, 13];

    $scope.isDefaultBuild = function(id) {

        if ($scope.defaultBuild.indexOf(id) !== -1) {
            return true;
        }
        return false;
    };

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

    $scope.isFinished = function() {
        reloadBuilding(false);
    };

    $ionicPlatform.ready(function() {
        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('landscape');
        }
    });

    var reloadBuilding = function(loading) {

        if (loading == true) {
            $ionicLoading.show();
        }

        Build.building().then(function (data) {
            $scope.building         = data.buildings;
            $scope.buildInProgress  = data.buildInProgress;
            $scope.builders         = data.builders;
            $scope.emps             = data.emps;

            if (loading == true) {
                $ionicLoading.hide();
            }

            $rootScope.$broadcast('refresh:user');
        });
    };
    reloadBuilding(true);

    $scope.vscroll = function(direction){
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
    };


    /**
     * Method : Add batiment
     */
    $scope.launchBatiment = function(id) {
        Build.add(id).then(function(data) {
            $scope.modalBuild.hide().then(function() {
                $ionicLoading.hide().then(function() {
                    if (data.status == 'nok') {

                        $ionicPopup.alert({
                            title: 'Construction impossible',
                            template: data.message
                        });
                    } else {

                        $scope.building         = data.data.buildings;
                        $scope.buildInProgress  = data.data.buildInProgress;
                        $scope.builders         = data.data.builders;
                        $scope.emps             = data.data.emps;

                        $rootScope.$broadcast('refresh:user');
                    }
                });
            })
        }, function() {

        });
    };

    $scope.launchBatimentWithEmp = function(id) {
        Build.addEmp(id, $scope.selectedEmp).then(function(data) {

            $scope.selectedEmp = null;

            $scope.modalBuilder.hide().then(function() {
                $ionicLoading.hide().then(function() {
                    if (data.status == 'nok') {

                        $ionicPopup.alert({
                            title: 'Construction impossible',
                            template: data.message
                        });
                    } else {

                        $scope.building         = data.data.buildings;
                        $scope.buildInProgress  = data.data.buildInProgress;
                        $scope.builders         = data.data.builders;
                        $scope.emps             = data.data.emps;

                        $rootScope.$broadcast('refresh:user');
                    }
                });
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
    $scope.builder = function(emp) {
        console.log(emp);
        $scope.selectedEmp = emp;
        $scope.modalBuilder.show();
    };
    $scope.closeModal = function() {
        $scope.selectedEmp = null;
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
angular.module('starter.controllers')
.controller('AppEmpire', function($scope, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, $rootScope, $q, $location, $state) {




});
angular.module('starter.controllers')
.controller('AppHistory', function($scope, $ionicPlatform, $state) {

    $scope.button = false;

    setTimeout(function() {
        $scope.button = true;
    }, 8000);

    $ionicPlatform.ready(function() {
        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('landscape');
        }
    });


    $scope.goToHome = function() {
        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('portrait');
        }

        $state.go('app.home');
    }
    

});
angular.module('starter.controllers')
.controller('AppHome', function($scope, $ionicPlatform, Account) {
    Account.me().then(function(user) {
        $scope.user = user;
    });
});
angular.module('starter.controllers')
.controller('AppMap', function($scope, $ionicPlatform, Map, $ionicLoading, $ionicSideMenuDelegate, $rootScope, $window) {

    $rootScope.position = {
        x: 1,
        y: 1
    };



    $scope.change = function(type) {

        if (type == 'top') {
            if ($rootScope.position.y == 1) {
                return ;
            }
            $rootScope.position.y--;
        }

        if (type == 'left') {
            if ($rootScope.position.x == 1) {
                return ;
            }
            $rootScope.position.x--;
        }

        if (type == 'right') {
            $rootScope.position.x++;
        }

        if (type == 'bottom') {
            $rootScope.position.y++;
        }

        $ionicLoading.show();
        Map.get($rootScope.position).then(function(data) {
            $scope.data = data;
            $ionicLoading.hide();
        });

    };

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

    $ionicPlatform.ready(function() {
        if (typeof screen.unlockOrientation === "function") {
            screen.unlockOrientation();
            screen.lockOrientation('landscape');
        }


        $ionicLoading.show();
        Map.get($rootScope.position).then(function(data) {
            $scope.data = data;
            $ionicLoading.hide();
        });


    });

});
angular.module('starter.controllers')
.controller('AppMenu', function($scope, $ionicSideMenuDelegate, Account, OAuth, OAuthToken, CacheFactory, $location, $rootScope, $ionicNavBarDelegate, $ionicLoading, $ionicModal, $ionicPush) {


    $scope.changePlanetSelected = function(planetSelected) {
        $ionicLoading.show();
        Account.changePlanetSelected(planetSelected.id).then(function(user) {
            $rootScope.user = user;
            $scope.buildingsInProgress      = user.getBuilding();
            $scope.technologiesInProgress   = user.getTechnology();
            $ionicLoading.hide();
        }, function() {

            $ionicLoading.hide();
        });
    };


    $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.toggleRightSideMenu = function() {
        $ionicSideMenuDelegate.toggleRight();
    };

    var loadUser = function(ionicLoad, ionicPush, history) {

        if (ionicLoad) {
            $ionicLoading.show();
        }

        Account.me().then(function(user) {
            $rootScope.user = user;
            $scope.buildingsInProgress = user.getBuilding();
            $scope.technologiesInProgress = user.getTechnology();
            $scope.planetSelected = user.planet_selected;


            if (ionicPush) {
                $ionicPush.register().then(function(t) {
                    return $ionicPush.saveToken(t);
                }).then(function(t) {
                    Account.addDeviceId(t).then(function() {
                        console.info('ADD Device ID');
                    });
                    console.log('Token saved:', t.token);
                });

                $scope.$on('cloud:push:notification', function(event, data) {
                    console.log('New notification');
                });
            }

            if (ionicLoad) {
                $ionicLoading.hide();
            }
        });
    };

    loadUser(true, true, true);

    $rootScope.refreshUser = function() {

        if (OAuth.isAuthenticated()) {
            loadUser(false, false, false);
        }

        setTimeout(function() {
            $rootScope.refreshUser();
        }, 25000)
    };
    $rootScope.refreshUser();


    $rootScope.$on('refresh:user', function () {
        console.log('Refresh User by Event');
        loadUser(false, false);
    });

    $scope.logout = function() {

        if (OAuth.isAuthenticated()) {
            OAuthToken.removeToken();
            CacheFactory.destroyAll();
            $location.path('/homepage');
        }

    };

    $scope.numberFormatter= function(num, digits) {
        var si = [
            { value: 1E18, symbol: "E" },
            { value: 1E15, symbol: "P" },
            { value: 1E12, symbol: "T" },
            { value: 1E9,  symbol: "G" },
            { value: 1E6,  symbol: "M" },
            { value: 1E3,  symbol: "k" }
        ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
        for (i = 0; i < si.length; i++) {
            if (num >= si[i].value) {
                return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
            }
        }
        return num.toFixed(digits).replace(rx, "$1");
    };

    $rootScope.numberFormated = function numberWithCommas(x) {

        x = Math.floor(x);

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    $rootScope.goBack = function () {
        $ionicNavBarDelegate.back();
    };

    $rootScope.timer = function(value) {
        var startTimeStamp = new Date(value.start).getTime();
        var endTimeStamp = new Date(value.end).getTime();
        var current = new Date().getTime();
        var percent = 100 - (((endTimeStamp - current) * 100) / (endTimeStamp - startTimeStamp));
        return percent.toFixed(2);
    };

    $rootScope.timeValue = function(value) {
        if (typeof value == 'undefined') {
            return false;
        }
        var startTimeStamp = new Date(value.start).getTime();
        var endTimeStamp = new Date(value.end).getTime();
        var current = new Date().getTime();

        return (endTimeStamp - current) / 1000;
    };

    $rootScope.timerAff = function(value) {
        if (typeof value == 'undefined') {
            return false;
        }
        var startTimeStamp = new Date(value.start).getTime();
        var endTimeStamp = new Date(value.end).getTime();
        var current = new Date().getTime();

        var time = (endTimeStamp - current) / 1000;

        if (time <= 0) {
            return "Terminé";
        }

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

});
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
angular.module('starter.controllers')
.controller('AppTchat', function($scope, $ionicPlatform, $ionicScrollDelegate, $ionicLoading, $location, Tchat, $q, Account) {



    var loadMessage = function(ionicLoading) {

        var q = $q.defer();

        if (ionicLoading) {
            $ionicLoading.show();
        }
        Tchat.getLast().then(function (data) {

            $scope.messages = data;

            if (ionicLoading) {
                $ionicLoading.hide().then(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                    $scope.$broadcast('scroll.refreshComplete');
                });
            } else {
                $ionicScrollDelegate.scrollBottom(true);
                $scope.$broadcast('scroll.refreshComplete');
            }

            q.resolve('ok');
        }, function() {
            q.reject('nok');
        });

        setTimeout(function() {
            if ($location.path() == '/app/tchat') {
                loadMessage(false);
            }
        }, 8000);

        return q.promise;
    };

    var promiseMessage = loadMessage(false);
    var promiseUser = Account.me(function(user) {
        $scope.user = user;
    });

    $ionicLoading.show();

    $q.all([
        promiseMessage,
        promiseUser
    ]).then(function() {
        $ionicLoading.hide().then(function () {
            $ionicScrollDelegate.scrollBottom(true);
            $scope.$broadcast('scroll.refreshComplete');
        });
    });

    $scope.input = {};

    $scope.sendMessage = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();

        Tchat.add($scope.input.message).then(function(data) {

            $scope.messages     = data;
            $scope.input        = {};

            $ionicLoading.hide().then(function() {
                $scope.$broadcast('scroll.refreshComplete');
                $ionicScrollDelegate.scrollBottom(true);
            });
        })
    };


});
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
angular.module('starter.controllers')
.controller('Error', function($scope, $ionicPlatform, $state) {

    $scope.reloadRequest = function() {
        $state.go('homepage',null,{reload:true});
    };

}).controller('Maj', function($scope, $ionicPlatform, $state, Api, $ionicLoading) {

    $scope.maintenance = {};
    $ionicLoading.show();

    Api.info().then(function (response) {
        $scope.maintenance = response.data;
    }, function () {

    }).finally(function() {
        $ionicLoading.hide();
    });

    $scope.config = Config;

}).controller('Maintenance', function($scope, $ionicPlatform, $state, Api, OAuth, $ionicLoading, $location) {

    $scope.maintenance = {};

    $scope.load = function() {

        $ionicLoading.show();

        Api.info().then(function (response) {
            $scope.maintenance = response.data;

            console.log(response.data);

            if ($scope.maintenance.maintenance_game == false) {
                if (OAuth.isAuthenticated()) {
                    $location.path('/app/account');
                } else {
                    $location.path('/homepage');
                }
            }
        }, function () {

        }).finally(function() {
            $ionicLoading.hide();
        });


    };

    $scope.load();

});
angular.module('starter.controllers')
.controller('HomePage', function($scope, $ionicPlatform, Api, Account, OAuth, $location, $ionicLoading, $ionicPopup) {


    if (OAuth.isAuthenticated()) {
        $location.path('/app/account');
    }


    $scope.login = {};

    $scope.doLogin = function(form) {
        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();

        OAuth.getAccessToken($scope.login).then(function(success) {
            $location.path('/app/account');
            $ionicLoading.hide();
        }, function(error) {
            $ionicLoading.hide().then(function() {
                $ionicPopup.alert({
                    title: 'Connexion impossible',
                    template: 'Le nom d\'utilisateur et/ou le mot de passe ne sont pas valides.'
                });
            });
        });
    };

    $scope.facebookLogin = function() {

        $ionicPlatform.ready(function() {
            facebookConnectPlugin.login(['public_profile', 'email'], function(success) {

                if (success.status == "connected") {


                    var accessToken = success.authResponse.accessToken;
                    var userID = success.authResponse.userID;

                    Account.facebookConnect(accessToken, userID);
                }


            }, function(error) {



            });
        });
    };

})
.controller('Register', function($scope, $ionicPlatform, Account, $ionicLoading) {


    $scope.registration = {};

    $scope.doRegister = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();


        Account.create($scope.registration).then(function(data) {



        }, function(data) {
            console.log(data);
        }).finally(function() {
            $ionicLoading.hide();
        });

    };


})
.controller('Password', function($scope, $ionicPlatform) {



});