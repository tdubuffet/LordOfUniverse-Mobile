angular.module('starter.services')
.factory('Api', ['$http', '$cookies', '$q', function($http, $cookies, $q) {

    var oAuth = {};

    oAuth.oAuthCredential = false;

    if (typeof $cookies.getObject('oAuthCredential') != 'undefined') {
        oAuth.oAuthCredential = $cookies.getObject('oAuthCredential');
    }

    oAuth.accessTokenCredentials = function()
    {
        var deferred = $q.defer();

        if (oAuth.oAuthCredential != false) {
            deferred.resolve(oAuth.oAuthCredential.access_token);

            return deferred.promise;
        }

        var post = {
            client_id: Config.client_id,
            client_secret: Config.client_secret,
            grant_type: 'client_credentials'
        };


        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_token,
            queryString.stringify(post),
            options
        ).success(function(data,status,headers,config){

            var expires = new Date();

            expires.setSeconds(expires.getSeconds() + data.expires_in);

            $cookies.putObject('oAuthCredential', data, {
                expires:expires
            });

            oAuth.oAuthCredential = data;

            deferred.resolve(data.access_token);
        })

        .error(function(data,status,headers,config){
            deferred.reject('Error');
        });

        return deferred.promise;
    };


    return oAuth;

}]);
