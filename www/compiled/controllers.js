angular.module('starter.controllers')
.controller('AppAccount', function($scope, $ionicPlatform, Account) {

    Account.me().then(function(user) {
        $scope.user = user;
    });

});
angular.module('starter.controllers')
.controller('AppHome', function($scope, $ionicPlatform, Account) {
    Account.me().then(function(user) {
        $scope.user = user;
    });
});
angular.module('starter.controllers')
.controller('AppMap', function($scope, Map) {

    Map.get().then(function(data) {
        console.log(data);
    });

});
angular.module('starter.controllers')
.controller('AppMenu', function($scope, $ionicSideMenuDelegate, Account, OAuth, OAuthToken, CacheFactory, $location) {

    $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    Account.me().then(function(user) {
        $scope.user = user;
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
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicScrollDelegate.scrollBottom(true);
                });
            } else {
                $scope.$broadcast('scroll.refreshComplete');
                $ionicScrollDelegate.scrollBottom(true);
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
            $scope.$broadcast('scroll.refreshComplete');
            $ionicScrollDelegate.scrollBottom(true);
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
            console.log(error);
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

                console.log(error);

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

        console.log($scope.registration);
    };


})
.controller('Password', function($scope, $ionicPlatform) {



});