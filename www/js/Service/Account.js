angular.module('starter.services')
.factory('Account', ['$http', '$q', 'Api', 'Cache', 'UserModel', function($http, $q, Api, Cache, UserModel) {


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

        var user = Cache.getPromise('/me').then(function(user) {
            q.resolve(user);
        }, function() {
            $http.get(
                Config.path_api + '/user/me'
            )
            .success(function (data) {
                var Model = UserModel.get(data);
                Cache.putExp('/me', Model, Cache.timeExp.user_me);
                q.resolve(Model);
            });
        });

        return q.promise;
    };

    return Account;


}]);
