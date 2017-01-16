angular.module('starter.services')
.factory('UserModel', function() {


    var Account = {};

    Account.get = function(data) {


        if (data.avatar == null) {
            data.avatar = 'img/avatar.jpg';
        }

        if (data.description == null) {
            data.description = 'Aucune description sur ce joueur.';
        }

        return angular.merge(Account, data);
    };

    return Account;

});