'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PageRecommendation', require('./services/pageRecommendation'));
app.service('BlogRecommendation', require('./services/blogRecommendation'));
app.service('PopularRecommendation', require('./services/popularRecommendation'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('recommendation', {
            abstract: true,
            url: '/recommendation'
        })
        .state('recommendation.popular', {
            url: '/popular',
            views: {
                'content@': {
                    template: '<ely-recommendation></ely-recommendation>'
                }
            }
        });
}]);