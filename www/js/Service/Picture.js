angular.module('starter.services')
.factory('Picture', ['$http', '$cookies', '$q', function($http, $cookies, $q) {

    var Picture = {};


    Picture.sendAlly = function(image) {
        var post = {
            image: image
        };

        return $http.post(
            Config.path_api + '/picture/ally',
            queryString.stringify(post),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        );
    };

    Picture.sendAllyIcon = function(image) {
        var post = {
            image: image
        };

        return $http.post(
            Config.path_api + '/picture/ally/icon',
            queryString.stringify(post),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        );
    };

    return Picture;
}]);
