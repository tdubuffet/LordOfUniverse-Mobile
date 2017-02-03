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

    return Ally;

}]);
