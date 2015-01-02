'use strict';

var app = require('angular').module('elyoosApp');

app.controller('LoginCtrl', require('./loginCtrl'));
app.controller('LogoutCtrl', require('./logoutCtrl'));

app.service('Auth', require('./auth'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('public.login', {
            url: '/login',
            views: {
                'content@': {
                    templateUrl: 'app/modules/auth/login.html',
                    controller: 'LoginCtrl'
                }
            },
            isPublic: true
        })
        .state('public.logout', {
            url: '/logout',
            views: {
                'content@': {
                    templateUrl: 'app/modules/auth/logout.html',
                    controller: 'LogoutCtrl'
                }
            },
            isPublic: true
        });
}]);