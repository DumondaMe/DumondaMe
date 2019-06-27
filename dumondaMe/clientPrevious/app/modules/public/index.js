'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('Auth', require('./services/auth'));
app.service('ResetPasswordRequest', require('./services/resetPasswordRequest'));
app.service('ResetPassword', require('./services/resetPassword'));
app.service('UnsubscribeInvitation', require('./services/unsubscribeInvitation'));

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
        .state('public.unsubscribe', {
            abstract: true,
            url: '/unsubscribe',
            isPublic: true
        })
        .state('public.unsubscribe.invitation', {
            url: '/invitation/:email',
            views: {
                'content@': {
                    template: '<ely-unsubscribe-invitation></ely-unsubscribe-invitation>'
                }
            },
            isPublic: true
        })
        .state('public.password', {
            abstract: true,
            url: '/password',
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
        .state('public.donate', {
            url: '/donate',
            views: {
                'content@': {
                    template: '<ely-public-donate></ely-public-donate>'
                }
            },
            isPublic: true
        })
        .state('public.function', {
            url: '/function',
            views: {
                'content@': {
                    template: '<ely-public-function></ely-public-function>'
                }
            },
            isPublic: true
        })
        .state('public.news', {
            url: '/news',
            views: {
                'content@': {
                    template: '<ely-public-news></ely-public-news>'
                }
            },
            isPublic: true
        })
        .state('public.about', {
            url: '/about',
            views: {
                'content@': {
                    template: '<ely-public-about></ely-public-about>'
                }
            },
            isPublic: true
        });
}]);