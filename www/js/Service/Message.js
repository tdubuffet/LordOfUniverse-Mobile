angular.module('starter.services')
.factory('Message', ['$http', '$cookies', '$q', function($http, $cookies, $q) {

    var Message = {};


    Message.me = function() {
        return $http.get(
            Config.path_api + '/message/'
        );
    };

    return Message;
}]);
