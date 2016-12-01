'use strict';

require('angular-ui-route');

var app = angular.module('elyoosApp', [
    'config',
    'ui.router',
    'ngSanitize',
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'ngMessages',
    'ngMaterial',
    'duScroll'
]);

app.constant('VERSION', require('../../package.json').version);

require('templates');
require('duScroll');

var setMaterialDesignSettings = function ($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('red');

    $mdThemingProvider.theme('error-toast');

    $mdIconProvider.iconSet('icons', 'app/img/icons.svg', 24);
};

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$compileProvider', '$mdThemingProvider',
    '$mdIconProvider', 'elyoosVersion',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $compileProvider, $mdThemingProvider,
              $mdIconProvider, elyoosVersion) {

        $compileProvider.debugInfoEnabled(false);

        $urlRouterProvider.otherwise('/home/');
        $urlRouterProvider.when('', '/home/');
        $httpProvider.defaults.headers.common.elyoosversion = elyoosVersion.version;

        $stateProvider
            .state('home', {
                url: '/home/{cache}',
                views: {
                    content: {
                        template: '<ely-home></ely-home>'
                    }
                },
                data: {hasBackNav: false, hasSearch: true, searchServiceName: 'home', title: 'Home'}
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

        $httpProvider.interceptors.push(['$q', '$location', 'loginStateHandler', 'updateStateHandler',
            function ($q, $location, loginStateHandler, updateStateHandler) {
                return {
                    'responseError': function (response) {
                        if (response.status === 401 || response.status === 403) {
                            loginStateHandler.logoutEvent();
                            $location.path('/');
                        } else if (response.status === 418) {
                            updateStateHandler.setUpdateRequested(true);
                            return $q.resolve(response);
                        }
                        return $q.reject(response);
                    }
                };
            }]);

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

        setMaterialDesignSettings($mdThemingProvider, $mdIconProvider);

    }]).run(['$rootScope', '$state', 'CheckLoginStateParamsContainer', 'userInfo', 'updateStateHandler',
    function ($rootScope, $state, CheckLoginStateParamsContainer, userInfo, updateStateHandler) {
        var firstRun = true;

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (firstRun) {
                firstRun = false;
                if (!toState.isPublic) {
                    event.preventDefault();
                    CheckLoginStateParamsContainer.setParams(toState.name, toParams);
                    $state.go('checkLoginState', null, {location: false});
                }
            }
        });
        $rootScope.$on('$stateChangeSuccess', function () {
            if (updateStateHandler.isUpdateRequestPending()) {
                updateStateHandler.setUpdateRequested(false);
                window.location.reload();
            }
        });
    }]);