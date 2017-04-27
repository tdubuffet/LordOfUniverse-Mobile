angular.module('starter.controllers')
.controller('AppHelp', function($scope, $ionicPlatform) {




}).controller('AppContact', function($scope, $ionicPlatform, $ionicLoading) {



    $scope.formContact = {
        subject: '',
        message: ''
    };

    $scope.sendMessage = function(form) {

        if (form.$invalid) {
            return;
        }

        $ionicLoading.show();

        Tchat.add($scope.formContact).then(function(data) {

            $scope.formContact = {
                subject: '',
                message: ''
            };
        })
    };


})
.controller('AppLegal', function($scope, $ionicPlatform, $ionicLoading, Api) {

    $ionicLoading.show();
    Api.info().then(function(response) {

        console.log(response.data);
        $scope.config = response.data;

    }).finally(function() {

        $ionicLoading.hide();

    });

});