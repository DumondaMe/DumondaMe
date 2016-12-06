'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('FeedbackOverview', require('./services/overview'));

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
        });
}]);