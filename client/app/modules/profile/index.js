'use strict';

var app = require('angular').module('elyoosApp');

app.controller('ProfileDefaultCtrl', require('./profileDefaultCtrl'));
app.controller('ProfileRecommendationCtrl', require('./profileRecommendationCtrl'));

app.service('ProfileRecommendationCtrl', require('./sendRecommendation'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('profile', {
            abstract: true,
            url: '/profile',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html',
                    controller: 'PagesHeaderCtrl'
                }
            }
        })
        .state('profile.default', {
            url: '/default',
            views: {
                'content@': {
                    templateUrl: 'app/modules/profile/profileDefault.html',
                    controller: 'ProfileDefaultCtrl'
                }
            }
        })
        .state('profile.recommendation', {
            url: '/recommendation',
            views: {
                'content@': {
                    templateUrl: 'app/modules/profile/profileRecommendations.html',
                    controller: 'ProfileRecommendationCtrl'
                }
            }
        });
}]);