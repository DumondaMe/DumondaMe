'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('feedback', {
            url: '/feedback',
            views: {
                'content@': {
                    template: '<ely-feedback></ely-feedback>'
                }
            },
            data: {hasBackNav: true, title: 'Feedback'}
        })
        .state('feedback.detail', {
            url: '/detail/{feedbackId}/{discussionId}',
            views: {
                'content@': {
                    template: '<ely-feedback-detail></ely-feedback-detail>'
                }
            },
            data: {hasBackNav: true, backNavToState: true, defaultBackNavState: 'feedback', title: 'Feedback'}
        });
}]);
