'use strict';

var app = angular.module('elyoosApp');

app.service('PageRecommendationAllContact', require('./services/pageRecommendationAllContact'));
app.service('PageRecommendationOtherUser', require('./services/pageRecommendationOtherUser'));
app.service('PageDetail', require('./services/pageDetail'));
app.service('UserPage', require('./services/userPage'));
app.service('SearchPage', require('./services/searchPage'));
app.service('PlaceSuggestion', require('./services/placeSuggestion'));
app.service('PopularPages', require('./services/popularPages'));
app.service('PageCategories', require('./services/categories'));
app.service('PageUserRecommendation', require('./services/pageUserRecommendation'));
app.service('PageUserAdministration', require('./services/pageUserAdministration'));
app.service('PageSearchUserRecommendation', require('./services/pageSearchUserRecommendation'));
app.service('PageSearchUserAdministratedPage', require('./services/pageSearchUserAdministratedPage'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('page', {
            abstract: true,
            url: '/page'

        })
        .state('page.overview', {
            url: '/overview',
            views: {
                'content@': {
                    template: '<ely-page-overview></ely-page-overview>'
                }
            }
        })
        .state('page.detail', {
            url: '/detail/{label}/{pageId}',
            views: {
                'content@': {
                    template: '<ely-page-detail></ely-page-detail>'
                }
            }
        });
}]);