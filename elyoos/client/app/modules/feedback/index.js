'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('FeedbackOverview', require('./services/overview'));
app.factory('FeedbackOverviewGroup', require('./services/overviewGroup'));
app.factory('FeedbackRecommendation', require('./services/recommendation'));

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
        .state('feedback.overview', {
            url: '/overview/{group}',
            views: {
                'content@': {
                    template: '<ely-feedback-overview-group></ely-feedback-overview-group>'
                }
            },
            data: {hasBackNav: true, backNavToState: true, defaultBackNavState: 'feedback', title: 'Feedback'}
        });
}]);