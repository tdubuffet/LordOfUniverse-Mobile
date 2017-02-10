angular.module('starter.services')
.factory('UserModel', function() {


    return function() {

        var Account = {};

        Account.get = function (data) {


            if (data.avatar == null) {
                data.avatar = 'img/avatar.jpg';
            }

            if (data.description == null) {
                data.description = 'Aucune description sur ce joueur.';
            }

            return angular.merge(Account, data);
        };

        Account.getBuildInProgressByType = function (type) {

            var values = [];

            angular.forEach(Account.planet_selected.build_in_progress, function (value, key) {
                if (value.build_planet.build.type == type) {
                    values.push(value);
                }
            });

            return values;

        };

        Account.getBuilding = function () {
            return Account.getBuildInProgressByType('building');
        };

        Account.getTechnology = function () {
            return Account.getBuildInProgressByType('technology');
        };

        Account.getApparatus = function () {
            return Account.getBuildInProgressByType('apparatus');
        };

        return Account;
    };

});