// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angular-oauth2', 'angular-cache'])

    .run(function ($ionicPlatform, OAuth) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
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
            .state('app.account', {
                url: '/account',
                views: {
                    'content': {
                        templateUrl: "js/Pages/App/Account/index.html",
                        controller: 'AppAccount'
                    }
                }
            })

        ;

        $urlRouterProvider.otherwise('/homepage');
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common = 'Content-Type: application/json';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $httpProvider.interceptors.push('BearerAuthInterceptor');
    }
    ])
    .factory('BearerAuthInterceptor', function ($window, $q, $injector, $location) {

        var OAuth = $injector.get('OAuthToken');

        return {
            request: function(config) {
                config.headers = config.headers || {};
                if (OAuth.getAccessToken()) {
                    // may also use sessionStorage
                    config.headers.Authorization = 'Bearer ' + OAuth.getAccessToken();
                }
                return config || $q.when(config);
            },
            responseError: function(response) {

                if (response.status === 401) {



                    if (
                        response.data.error === "invalid_grant" ||
                        response.data.error === "access_denied"
                    ) {
                        var stateService = $injector.get('$state');
                        stateService.go('homepage');
                    }

                }

                return response || $q.when(response);
            },
            response: function(response) {
                if (response.status === 401) {
                    //  Redirect user to login page / signup Page.
                }
                return response || $q.when(response);
            }
        };
    });