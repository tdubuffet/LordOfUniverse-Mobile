angular.module('starter.services')
.factory('Tchat', ['$http', '$q', 'Api', 'Cache', function($http, $q, Api, Cache) {


    var Tchat = {};

    Tchat.getLast = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/chat/'
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {
            q.reject('error');
        });

        return q.promise;
    };

    Tchat.add = function(message) {

        var q = $q.defer();

        var post = {
            message: message,
        };

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
