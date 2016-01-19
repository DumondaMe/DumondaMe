'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('Problem', require('./services/problem'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('problem', {
            abstract: true,
            url: '/problem'
        })
        .state('problem.home', {
            url: '/home',
            views: {
                'content@': {
                    template: '<ely-problem></ely-problem>'
                }
            }
        })
        .state('problem.detail', {
            url: '/detail/:problemId',
            views: {
                'content@': {
                    template: '<ely-problem-detail></ely-problem-detail>'
                }
            }
        });
}]);
