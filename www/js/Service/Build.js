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

    return Build;


}]);
