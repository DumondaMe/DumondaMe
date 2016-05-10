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
            hasSearch: true
        })
        .state('forum.detail', {
            url: '/detail/:problemId',
            views: {
                'content@': {
                    template: '<ely-forum-detail></ely-forum-detail>'
                }
            }
        });
}]);
