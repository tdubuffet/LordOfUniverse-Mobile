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
