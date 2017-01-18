angular.module('starter.controllers')
.controller('AppMap', function($scope, Map) {

    Map.get().then(function(data) {
        console.log(data);
    });

});