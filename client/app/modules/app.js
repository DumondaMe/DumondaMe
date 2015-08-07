'use strict';

var angular = require('angular');
require('angular-ui-route');
require('angular-cookies');
require('angular-sanitize');
require('angular-animate');
require('angular-resource');
require('angular-strap');
require('angular-strap-tpl');
require('infinit-scroll');

var app = angular.module('elyoosApp', [
    'ui.router',
    'ngSanitize',
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'mgcrea.ngStrap',
    'infinite-scroll'
]);

app.constant('VERSION', require('../../package.json').version);

require('templates');

require('./auth');
require('./contact');
require('./directives');
require('./filters');
require('./home');
require('./navigation');
require('./settings');
require('./util');

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$modalProvider', '$compileProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $modalProvider, $compileProvider) {

        $compileProvider.debugInfoEnabled(false);

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home/{cache}',
                views: {
                    content: {
                        templateUrl: 'app/modules/home/home.html',
                        controller: 'HomeCtrl'
                    },
                    header: {
                        templateUrl: 'app/modules/navigation/loggedInHeader.html',
                        controller: 'LoggedInHeaderCtrl'
                    }
                },
                hasNavigation: true
            })
            .state('public', {
                abstract: true,
                views: {
                    header: {templateUrl: 'app/modules/navigation/publicHeader.html'}
                }
            });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);

        angular.extend($modalProvider.defaults, {
            html: true
        });

    }]).run(['$rootScope', '$state', '$window', 'Auth', function ($rootScope, $state, $window, Auth) {
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        if (!Auth.authorize(toState.isPublic)) {
            event.preventDefault();
            $state.go('login');
        } else if ($rootScope.fullScreen.show) {
            event.preventDefault();
            $rootScope.fullScreen.show = false;
            $state.go(fromState);
        } else if (!toState.isPublic) {
            if ($rootScope.isLoggedIn) {
                $rootScope.isLoggedIn();
            }
        }
    });

    //Settings for full screen detail view
    $rootScope.fullScreen = {
        show: false,
        template: ''
    };
}]);