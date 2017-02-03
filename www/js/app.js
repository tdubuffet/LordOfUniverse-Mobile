// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angular-oauth2', 'angular-cache', 'monospaced.elastic', 'ionic-toast'])

    .run(function ($ionicPlatform, OAuth) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            ionic.Platform.fullScreen();

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                //StatusBar.backgroundColorByHexString("#333");
            }

            OAuth.configure({
                baseUrl: Config.path,
                clientId: Config.client_id,
                clientSecret: Config.client_secret,
                options: {
                    secure: true
                },
                grantPath: '/oauth/v2/token',
                revokePath: '/oauth/v2/revoke'
            });

            if (navigator.splashscreen) {
                setTimeout(function() {
                    navigator.splashscreen.hide();
                }, 1000);
            }


        });
    })

    .config(function ($stateProvider, $urlRouterProvider, CacheFactoryProvider) {


        angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('homepage', {
                url: '/homepage',
                templateUrl: 'js/Pages/homepage/home.html',
                controller: 'HomePage'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'js/Pages/homepage/register.html',
                controller: 'Register'
            })
            .state('password', {
                url: '/password',
                templateUrl: 'js/Pages/homepage/password.html',
                controller: 'Password'
            })
            .state('app', {
                url: '/app',
                templateUrl: 'js/Pages/App/Menu/menu.html',
                abstract: true,
                controller: 'AppMenu'
            })
            .state('app.home', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Home/home.html",
                        controller: 'AppHome'
                    }
                }
            })
            .state('app.map', {
                url: '/map',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Map/index.html",
                        controller: 'AppMap'
                    }
                }
            })
            .state('app.building', {
                url: '/building',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Build/building.html",
                        controller: 'AppBuilding'
                    }
                }
            })
            .state('app.account', {
                url: '/account',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Account/index.html",
                        controller: 'AppAccount'
                    }
                }
            })
            .state('app.tchat', {
                url: '/tchat',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Tchat/index.html",
                        controller: 'AppTchat'
                    }
                }
            })

            .state('app.ally', {
                url: '/ally',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Ally/index.html",
                        controller: 'AppAlly'
                    }
                }
            })

            .state('app.ally-visitor', {
                url: '/ally/visitor',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Ally/ally_visitor.html",
                        controller: 'AppAllyVisitor'
                    }
                }
            })

            .state('app.empire', {
                url: '/empire',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Empire/index.html",
                        controller: 'AppEmpire'
                    }
                }
            })

            .state('app.profil', {
                url: '/profil/:id',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Account/profil.html",
                        controller: 'AppProfil'
                    }
                }
            })

            .state('app.message', {
                url: '/message',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Message/index.html",
                        controller: 'AppMessage'
                    }
                }
            })

            .state('app.message-thread', {
                url: '/message/thread/:threadId',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Message/thread.html",
                        controller: 'AppThread'
                    }
                }
            })

            .state('app.message-send', {
                url: '/message/send/:id',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Message/send.html",
                        controller: 'AppSend'
                    }
                }
            })

        ;

        $urlRouterProvider.otherwise('/homepage');
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.timeout = 1000;
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common = 'Content-Type: application/json';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $httpProvider.interceptors.push(['$q', '$injector', '$location',

            function ($q, $injector, $location) {

                var OAuthToken = $injector.get('OAuthToken');

                return {
                    request: function (config) {
                        config.headers = config.headers || {};
                        if (OAuthToken.getAccessToken()) {
                            // may also use sessionStorage
                            config.headers.Authorization = 'Bearer ' + OAuthToken.getAccessToken();
                        }
                        config.timeout = 20000;
                        var q = $q.defer();
                        q.resolve(config);
                        return q.promise;
                    },
                    responseError: function (response) {

                        console.log(response);

                        var retryRequest = function($http, config, deferred) {
                            function successCallback(response) {
                                deferred.resolve(response);
                            }
                            function errorCallback(response) {
                                deferred.reject(response);
                            }
                            $http(config).then(successCallback, errorCallback);
                        };


                        switch (response.status) {

                            case 401:


                                var deferred = $q.defer(); //moved deferred to here
                                var $http = $injector.get('$http');
                                var OAuth = $injector.get('OAuth');

                                if (response.data.error == 'invalid_grant') {

                                    OAuth.getRefreshToken().then(function(res) {
                                        retryRequest($http, response.config, deferred);


                                        return deferred.resolve(response);
                                    }, function() {

                                        $location.path('/homepage');
                                    });

                                    return deferred.promise;
                                }
                                if (response.data.error == 'access_denied') {

                                    console.log('access_denied');
                                    $location.path('/homepage');
                                }

                                break;


                            case 408:

                                console.log("Timeout request");

                                break;
                        }

                        return $q.reject(response);
                    }
                }
            }]);
    }])
    .constant('$ionicLoadingConfig', {
        template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner>'
    });