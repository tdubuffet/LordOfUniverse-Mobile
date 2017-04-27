angular.module('starter.services')
.factory('Account', ['$http', '$q', 'Api', 'Cache', 'UserModel', '$state', function($http, $q, Api, Cache, UserModel, $state) {


    var Account = {};


    Account.changePlanetSelected = function(id) {
        var q = $q.defer();

        $http.get(
            Config.path_api + '/planet/selected/' + id
        )
            .success(function (data) {
                var userModel = UserModel();
                var Model = userModel.get(data);
                q.resolve(Model);
            })
            .error(function() {
                $state.go('homepage');
            });

        return q.promise;
    };

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
            var userModel = UserModel();
            var Model = userModel.get(data);
            q.resolve(Model);
        })
        .error(function() {
            $state.go('homepage');
        });


        return q.promise;
    };

    Account.profil = function(id) {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/user/profil/' + id
        )
            .success(function (data) {
                q.resolve(data);
            })
            .error(function() {
                q.reject('nok');
            });


        return q.promise;
    };

    Account.addFriend = function(id) {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/user/add/friend/' + id
        )
            .success(function (data) {
                q.resolve(data);
            })
            .error(function() {
                q.reject('nok');
            });


        return q.promise;
    };

    Account.removeFriend = function(id) {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/user/remove/friend/' + id
        )
            .success(function (data) {
                q.resolve(data);
            })
            .error(function() {
                q.reject('nok');
            });


        return q.promise;
    };

    Account.profilFriends = function(id) {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/user/profil/' + id + '/friends'
        )
        .success(function (data) {
            q.resolve(data);
        })
        .error(function() {
            q.reject('nok');
        });


        return q.promise;
    };

    Account.friends = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/user/friends'
        )
        .success(function (data) {
            q.resolve(data);
        })
        .error(function() {
            q.reject('nok');
        });


        return q.promise;
    };

    Account.level = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/user/levels'
        )
            .success(function (data) {
                q.resolve(data);
            })
            .error(function() {
                q.reject('nok');
            });


        return q.promise;
    };

    Account.edit = function(post) {

        var q = $q.defer();

        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/user/edit',
            queryString.stringify(post),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        )
            .success(function(data){

                q.resolve(data);

            })

            .error(function(data){
                q.reject('nok');
            });

        return q.promise;
    };

    Account.create = function(data) {


        var q = $q.defer();

        Api.accessTokenCredentials().then(function(token) {

            var post = {
                access_token: token,
                username: data.username,
                email: data.email,
                password: data.password
            };

            var options = {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };

            $http.post(
                Config.path_api + '/user/',
                queryString.stringify(post),
                {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            )
                .success(function (data) {

                    q.resolve(data);

                })

                .error(function (data) {
                    q.reject('nok');
                });

        }, function() {
            q.reject('nok');
        });


        return q.promise;
    };

    Account.addDeviceId = function(device) {

        var q = $q.defer();

        var post = device;

        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/user/device_id/' + device.id,
            queryString.stringify(post),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        )
            .success(function(data){

                q.resolve(data);

            })

            .error(function(data){
                q.reject('nok');
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
            q.reject('nok');
        });


        return q.promise;

    };

    Ally.create =  function(form) {

        return $http.post(
            Config.path_api + '/ally/create',
            queryString.stringify(form),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        );
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

    Ally.visitor =  function(id) {

        return $http.get(
            Config.path_api + '/ally/id/' + id
        );
    };

    Ally.exit =  function(id) {
        return $http.get(
            Config.path_api + '/ally/exit'
        );
    };

    Ally.recruitment =  function(id, message) {

        var form = {
            ally: id,
            message: message
        };

        return $http.post(
            Config.path_api + '/ally/recruitment',
            queryString.stringify(form),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        );

    };

    Ally.recruitmentValidation =  function(id, validated) {

        var form = {
            validated: validated
        };

        return $http.post(
            Config.path_api + '/ally/recruitment/' + id,
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

    oAuth.info = function() {
        return $http.get(
            Config.path_api + '/'
        );
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

    Build.population = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/build/population').then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.technology = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/build/technology').then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.apparatus = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/build/apparatus').then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.addApparatus = function(id, quantity) {

        var q = $q.defer();


        var post = {
            id: id,
            quantity: quantity
        };


        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/build/apparatus',
            queryString.stringify(post),
            options
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.addPopulation = function(id, quantity) {

        var q = $q.defer();


        var post = {
            id: id,
            quantity: quantity
        };


        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/build/population',
            queryString.stringify(post),
            options
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.addTechnology = function(id) {

        var q = $q.defer();


        var post = {
            id: id
        };


        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/build/technology',
            queryString.stringify(post),
            options
        ).then(function(response) {

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

    Build.addEmp = function(id, emp) {

        var q = $q.defer();


        var post = {
            id: id,
            emp: emp
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
.factory('Message', ['$http', '$cookies', '$q', function($http, $cookies, $q) {

    var Message = {};


    Message.me = function() {
        return $http.get(
            Config.path_api + '/message/'
        );
    };

    Message.report = function() {
        return $http.get(
            Config.path_api + '/message/report'
        );
    };

    Message.spy = function() {
        return $http.get(
            Config.path_api + '/message/spy'
        );
    };


    Message.system = function() {
        return $http.get(
            Config.path_api + '/message/system'
        );
    };

    Message.thread = function(id) {
        return $http.get(
            Config.path_api + '/message/thread/' + id
        );
    };

    Message.send = function(data) {
        var post = {
            user: data.user,
            subject: data.subject,
            message: data.message
        };

        return $http.post(
            Config.path_api + '/message/composer/new',
            queryString.stringify(post),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        );
    };

    Message.add = function(threadId, message) {

        var post = {
            id: threadId,
            message: message
        };

        return $http.post(
            Config.path_api + '/message/reply',
            queryString.stringify(post),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        );
    };

    return Message;
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
