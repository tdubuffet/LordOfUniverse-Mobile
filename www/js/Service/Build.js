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

    Build.technology = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/build/technology').then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.apparatus = function() {

        var q = $q.defer();

        $http.get(
            Config.path_api + '/build/apparatus').then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.addApparatus = function(id, quantity) {

        var q = $q.defer();


        var post = {
            id: id,
            quantity: quantity
        };


        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/build/apparatus',
            queryString.stringify(post),
            options
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.addTechnology = function(id) {

        var q = $q.defer();


        var post = {
            id: id
        };


        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/build/technology',
            queryString.stringify(post),
            options
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    Build.add = function(id) {

        var q = $q.defer();


        var post = {
            id: id
        };


        var options = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        $http.post(
            Config.path_api + '/build/building',
            queryString.stringify(post),
            options
        ).then(function(response) {

            q.resolve(response.data);
        }, function() {

            q.reject('error');
        });

        return q.promise;
    };

    return Build;


}]);
