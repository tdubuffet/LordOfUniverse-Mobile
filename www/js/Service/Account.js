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
