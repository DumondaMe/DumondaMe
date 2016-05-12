'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('ForumQuestion', require('./services/question'));
app.service('ForumPopularQuestion', require('./services/popularQuestion'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('forum', {
            abstract: true,
            url: '/forum'
        })
        .state('forum.question', {
            url: '/question',
            views: {
                'content@': {
                    template: '<ely-forum-question></ely-forum-question>'
                }
            },
            data: {title: 'Forum'}
        })
        .state('forum.question.detail', {
            url: '/detail/:questionId',
            views: {
                'content@': {
                    template: '<ely-forum-question-detail></ely-forum-question-detail>'
                }
            },
            data: {hasBackNav: true, backNavToState: true, defaultBackNavState: 'forum.question', hasSearch: false}
        });
}]);
