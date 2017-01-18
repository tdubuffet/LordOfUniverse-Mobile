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
