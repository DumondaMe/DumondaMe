'use strict';

var app = require('angular').module('elyoosApp');

app.controller('RecommendationHomeCtrl', require('./recommendationHomeCtrl'));

app.service('Recommendation', require('./services/recommendation'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('recommendation', {
            abstract: true,
            url: '/recommendation',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html'
                }
            }
        })
        .state('recommendation.home', {
            url: '/home',
            views: {
                'content@': {
                    templateUrl: 'app/modules/recommendation/home.html',
                    controller: 'RecommendationHomeCtrl'
                }
            }
        });
}]);