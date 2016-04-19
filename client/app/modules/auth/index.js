'use strict';

var app = angular.module('elyoosApp');

app.controller('RegisterCtrl', require('./registerCtrl'));

app.service('Auth', require('./auth'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'content@': {
                    template: '<ely-login></ely-login>'
                }
            },
            isPublic: true
        })
        .state('register', {
            url: '/register',
            views: {
                'content@': {
                    template: '<ely-register></ely-register>'
                }
            }
        });
}]);