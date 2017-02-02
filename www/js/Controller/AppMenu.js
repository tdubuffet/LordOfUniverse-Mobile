angular.module('starter.controllers')
.controller('AppMenu', function($scope, $ionicSideMenuDelegate, Account, OAuth, OAuthToken, CacheFactory, $location, $rootScope, $ionicNavBarDelegate) {

    $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    Account.me().then(function(user) {
        $rootScope.user = user;
        console.log(user);
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