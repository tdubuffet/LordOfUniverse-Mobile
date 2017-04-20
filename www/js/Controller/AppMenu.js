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