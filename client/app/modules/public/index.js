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
        .state('public.vision', {
            url: '/vision',
            views: {
                'content@': {
                    template: '<ely-public-vision></ely-public-vision>'
                }
            },
            isPublic: true
        })
        .state('public.testphase', {
            url: '/testPhase',
            views: {
                'content@': {
                    template: '<ely-public-testphase></ely-public-testphase>'
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
        .state('register', {
            url: '/register',
            views: {
                'content@': {
                    template: '<ely-register></ely-register>'
                }
            }
        });
}]);