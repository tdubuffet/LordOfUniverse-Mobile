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
angular.module('starter.controllers')
.controller('AppAlly', function($scope, $ionicPlatform, Ally, $ionicLoading, Tchat, $ionicScrollDelegate, Account,  $rootScope, $q, $location, $state) {

    $ionicLoading.show();
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



})
.controller('AppAllyVisitor', function($scope, $ionicPlatform, Ally, $ionicLoading, $ionicScrollDelegate,  $rootScope, $q, $location, $state) {



});
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
angular.module('starter.controllers')
.controller('AppEmpire', function($scope, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, $rootScope, $q, $location, $state) {




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

        $ionicSideMenuDelegate.canDragContent(false)


        $ionicLoading.show();
        Map.get($rootScope.position).then(function(data) {
            $scope.data = data;
            $ionicLoading.hide();
        });


    });

});
angular.module('starter.controllers')
.controller('AppMenu', function($scope, $ionicSideMenuDelegate, Account, OAuth, OAuthToken, CacheFactory, $location, $rootScope, $ionicNavBarDelegate) {

    $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    Account.me().then(function(user) {
        $rootScope.user = user;
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
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    $rootScope.goBack = function () {
        $ionicNavBarDelegate.back();
    };

});
angular.module('starter.controllers')
.controller('AppMessage', function($scope, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, $rootScope, $q, $location, $state, Message) {


    $scope.loadMessagePlayers = function() {
        $ionicLoading.show();
        Message.me().then(function(response) {
            $scope.players = response.data;
            $ionicLoading.hide();
        }, function() {
            $ionicLoading.hide();
        });
    };

    $scope.loadMessageSpy = function() {
        $ionicLoading.show();
        Message.spy().then(function(response) {
            $scope.spies = response.data;
            $ionicLoading.hide();
        }, function() {
            $ionicLoading.hide();
        });
    };

    $scope.loadMessageReport = function() {
        $ionicLoading.show();
        Message.report().then(function(response) {
            $scope.reports = response.data;
            $ionicLoading.hide();
        }, function() {
            $ionicLoading.hide();
        });
    };

    $scope.loadMessageSystem = function() {
        $ionicLoading.show();
        Message.system().then(function(response) {
            $scope.systems = response.data;
            $ionicLoading.hide();
        }, function() {
            $ionicLoading.hide();
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
.controller('HomePage', function($scope, $ionicPlatform, Api, Account, OAuth, $location) {


    $scope.login = {};

    if (OAuth.isAuthenticated()) {
        $location.path('/app/home');
    }

    $scope.doLogin = function(form) {
        if (form.$invalid) {
            return;
        }

        OAuth.getAccessToken($scope.login).then(function(success) {
            $location.path('/app/home');
        }, function(error) {
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
.controller('Register', function($scope, $ionicPlatform) {


    $scope.registration = {};

    $scope.doRegister = function(form) {

        if (form.$invalid) {
            return;
        }

    };


})
.controller('Password', function($scope, $ionicPlatform) {



});