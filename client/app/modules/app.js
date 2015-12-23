'use strict';

require('angular-ui-route');
require('angular-strap');
require('angular-strap-tpl');
require('ui-bootstrap');
require('ui-bootstrap-tpls');

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
    $mdIconProvider.iconSet('navFAB', 'app/img/fabNavigation.svg', 24);
    $mdIconProvider.iconSet('createBlog', 'app/img/createBlog.svg', 24);
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
                url: '/{next}',
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

    }]).run(['$rootScope', '$state', 'loginStateHandler', 'userInfo', function ($rootScope, $state, loginStateHandler, userInfo) {
    var firstRun = true;

    loginStateHandler.register(userInfo);

    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (firstRun) {
            firstRun = false;
            event.preventDefault();
            $state.go('checkLoginState', {next: toState.name}, {location: false});
        }
    });
}]);