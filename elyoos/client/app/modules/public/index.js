'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('Auth', require('./services/auth'));
app.service('ResetPasswordRequest', require('./services/resetPasswordRequest'));
app.service('ResetPassword', require('./services/resetPassword'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('public', {
            url: '',
            views: {
                'content@': {
                    template: '<ely-public></ely-public>'
                }
            },
            isPublic: true
        })
        .state('public.password', {
            abstract: true,
            url: '/password',
            data: {title: 'Dein Profil'},
            isPublic: true
        })
        .state('public.password.reset', {
            url: '/reset/:linkId',
            views: {
                'content@': {
                    template: '<ely-password-reset></ely-password-reset>'
                }
            },
            isPublic: true
        })
        .state('public.register', {
            abstract: true,
            url: '/register',
            isPublic: true
        })
        .state('public.register.verify', {
            url: '/verify/:linkId',
            views: {
                'content@': {
                    template: '<ely-public></ely-public>'
                }
            },
            isPublic: true
        })
        .state('public.terms', {
            url: '/terms',
            views: {
                'content@': {
                    template: '<ely-public-terms></ely-public-terms>'
                }
            },
            isPublic: true
        });
}]);