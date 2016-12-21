'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('FeedbackOverview', require('./services/overview'));
app.factory('FeedbackOverviewGroup', require('./services/overviewGroup'));
app.factory('FeedbackOverviewDiscussionIdea', require('./services/overviewDiscussionIdea'));
app.factory('FeedbackRecommendation', require('./services/recommendation'));
app.factory('FeedbackDetail', require('./services/detail'));
app.factory('FeedbackDetailComment', require('./services/detailComment'));
app.factory('UserFeedback', require('./services/userFeedback'));

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
            url: '/overview/{group}/{discussionId}',
            views: {
                'content@': {
                    template: '<ely-feedback-overview-group></ely-feedback-overview-group>'
                }
            },
            data: {hasBackNav: true, defaultBackNavState: 'feedback', title: 'Feedback'}
        })
        .state('feedback.detail', {
            url: '/detail/{group}/{feedbackId}',
            views: {
                'content@': {
                    template: '<ely-feedback-detail></ely-feedback-detail>'
                }
            },
            data: {hasBackNav: true, backNavToState: true, defaultBackNavState: 'feedback', title: 'Feedback'}
        });
}]);