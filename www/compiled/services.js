angular.module('starter.services')
.factory('Account', ['$http', '$q', 'Api', 'Cache', 'UserModel', '$state', function($http, $q, Api, Cache, UserModel, $state) {


    var Account = {};

    Account.facebookConnect = function(userID, accessToken) {

        Api.accessTokenCredentials().then(function(token) {

            var post = {
                access_token: token,
                userId: userID,
                accessToken: accessToken
            };


            var options = {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };

            $http.post(
                Config.path_api + '/oauth/facebook',
                queryString.stringify(post),
                {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            )
            .success(function(data){

                console.log(data);

            })

            .error(function(data){

            });

        });

    };

    Account.me = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/user/me'
        )
        .success(function (data) {
            var Model = UserModel.get(data);
            q.resolve(Model);
        })
        .error(function() {
            $state.go('homepage');
        });


        return q.promise;
    };

    return Account;


}]);

angular.module('starter.services')
.factory('Ally', ['$http', '$cookies', '$q', function($http, $cookies, $q) {

    var Ally = {};


    Ally.me = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/ally/'
        )
        .success(function (data) {
            q.resolve(data);
        })
        .error(function() {
            $state.go('homepage');
        });


        return q.promise;

    };

    Ally.editGeneral =  function(form) {

        return $http.post(
            Config.path_api + '/ally/general',
            queryString.stringify(form),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        );
    };

    return Ally;

}]);

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

angular.module('starter.services')
.factory('Build', ['$http', '$q', 'Api', 'Cache', function($http, $q, Api, Cache) {


    var Build = {};

    Build.building = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/build/building').then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.add = function(id) {

        var q = $q.defer();


        var post = {
            id: id
        };


        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/build/building',
            queryString.stringify(post),
            options
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    return Build;


}]);

angular.module('starter.services')
.factory('Cache', ['CacheFactory', '$q', function(CacheFactory, $q) {

    var Cache;

    if (!CacheFactory.get('cache')) {
        Cache = CacheFactory('cache', {
            maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes.
            cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
            deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will use `localStorage`.
        });
    }

    Cache.timeExp = {
        'user_me': 30
    };

    Cache.putExp =  function(key, data, sec) {

        var currentDate = new Date().getTime();
        var expCacheDate = currentDate + sec * 1000;


        Cache.put(key, data);
        Cache.put(key + '_date_exp', expCacheDate);
    };

    Cache.getPromise = function(key) {

        var q = $q.defer();

        if (Cache.get(key)) {
            var currentDate = new Date().getTime();
            if (Cache.get(key + '_date_exp') != null && currentDate  >= Cache.get(key + '_date_exp')) {
                Cache.remove(key);
                Cache.remove(key + '_date_exp');
                q.reject('cache_error_exp');
            } else {
                q.resolve(Cache.get(key));
            }
        } else {
            q.reject('cache_error');
        }


        return q.promise;

    };

    return Cache;

}]);
angular.module('starter.services')
.factory('Map', ['$http', '$q', 'Api', 'Cache', function($http, $q, Api, Cache) {


    var Map = {};

    Map.get = function(data) {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/map/', {
                params: { x: data.x, y: data.y }
            }
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    return Map;


}]);


angular.module('starter.services')
.factory('Tchat', ['$http', '$q', 'Api', 'Cache', function($http, $q, Api, Cache) {


    var Tchat = {};

    Tchat.getLast = function(allyId) {

        var path = Config.path_api + '/chat/';
        if (typeof allyId != "undefined") {
            var path = Config.path_api + '/chat/' + allyId;
        };

        var q = $q.defer();

        $http.get(
            path
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {
            q.reject('error');
        });

        return q.promise;
    };

    Tchat.add = function(message, allyId) {
        var post = {
            message: message,
        };
        if (typeof allyId != "undefined") {
            post.ally = allyId;
        };

        var q = $q.defer();

        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/chat/',
            queryString.stringify(post),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        )
        .success(function(data){
            q.resolve(data);
        })

        .error(function(data){
            q.reject(data);
        });

        return q.promise;
    };

    return Tchat;


}]);
