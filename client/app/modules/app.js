'use strict';

require('angular-ui-route');
require('angular-strap');
require('angular-strap-tpl');
require('ui-bootstrap');
require('ui-bootstrap-tpls');
require('infinit-scroll');

var app = angular.module('elyoosApp', [
    'ui.router',
    'ngSanitize',
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'ngMessages',
    'ui.bootstrap',
    'mgcrea.ngStrap.select',
    'mgcrea.ngStrap.popover',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.helpers.parseOptions',
    'infinite-scroll',
    'ngMaterial'
]);

app.constant('VERSION', require('../../package.json').version);

require('templates');

var setMaterialDesignSettings = function ($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('light-green');

    $mdThemingProvider.theme('error-toast');

    $mdIconProvider.iconSet('system', 'app/img/system.svg', 24);
    $mdIconProvider.iconSet('rating', 'app/img/rating.svg', 24);
    $mdIconProvider.iconSet('nav', 'app/img/navigation.svg', 24);
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

        setMaterialDesignSettings($mdThemingProvider, $mdIconProvider);

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