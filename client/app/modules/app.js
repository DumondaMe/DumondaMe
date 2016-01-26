'use strict';

require('angular-ui-route');

var app = angular.module('elyoosApp', [
    'ui.router',
    'ngSanitize',
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'ngMessages',
    'ngMaterial'
]);

app.constant('VERSION', require('../../package.json').version);

require('templates');

var setMaterialDesignSettings = function ($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('red');

    $mdThemingProvider.theme('error-toast');

    $mdIconProvider.iconSet('system', 'app/img/system.svg', 24);
    $mdIconProvider.iconSet('rating', 'app/img/rating.svg', 24);
    $mdIconProvider.iconSet('nav', 'app/img/navigation.svg', 24);
    $mdIconProvider.iconSet('sidenavHeader', 'app/img/sideNavHeader.svg', 24);
    $mdIconProvider.iconSet('navFAB', 'app/img/fabNavigation.svg', 24);
    $mdIconProvider.iconSet('createBlog', 'app/img/createBlog.svg', 24);
    $mdIconProvider.iconSet('cardActions', 'app/img/cardActions.svg', 24);
};

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$compileProvider', '$mdThemingProvider',
    '$mdIconProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $compileProvider, $mdThemingProvider,
              $mdIconProvider) {

        $compileProvider.debugInfoEnabled(false);

        $urlRouterProvider.otherwise('/home/');
        $urlRouterProvider.when('', '/home/');

        $stateProvider
            .state('home', {
                url: '/home/{cache}',
                views: {
                    content: {
                        template: '<ely-home></ely-home>'
                    }
                }
            })
            .state('checkLoginState', {
                url: '/',
                views: {
                    content: {
                        template: '<ely-check-login-state></ely-check-login-state>'
                    }
                }
            });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$q', '$location', 'loginStateHandler', function ($q, $location, loginStateHandler) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        loginStateHandler.logoutEvent();
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);

        setMaterialDesignSettings($mdThemingProvider, $mdIconProvider);

    }]).run(['$rootScope', '$state', 'CheckLoginStateParamsContainer', 'loginStateHandler', 'userInfo',
    function ($rootScope, $state, CheckLoginStateParamsContainer, loginStateHandler, userInfo) {
        var firstRun = true;

        loginStateHandler.register(userInfo);

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (firstRun) {
                firstRun = false;
                event.preventDefault();
                CheckLoginStateParamsContainer.setParams(toState.name, toParams);
                $state.go('checkLoginState', null, {location: false});
            }
        });
    }]);