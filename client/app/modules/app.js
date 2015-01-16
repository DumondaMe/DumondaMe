'use strict';

var angular = require('angular');
require('angular-ui-route');
require('angular-cookies');
require('angular-animate');
require('angular-resource');
require('angular-strap');
require('angular-strap-tpl');

var app = angular.module('elyoosApp', [
    'ui.router',
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'mgcrea.ngStrap'
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

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    content: {templateUrl: 'app/modules/home/home.html'},
                    header: {
                        templateUrl: 'app/modules/navigation/loggedInHeader.html',
                        controller: 'LogoutCtrl'
                    }
                }
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
    }]).run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {
    return Auth.checkIsAuthorizedOnServer().then(function () {
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (!Auth.authorize(toState.isPublic)) {
                event.preventDefault();
                $state.go('login');
            }
        });
    });

}]);