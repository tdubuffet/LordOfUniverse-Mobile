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
