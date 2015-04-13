'use strict';

var app = require('angular').module('elyoosApp');

app.controller('PageOverviewCtrl', require('./pageOverviewCtrl'));

app.service('Page', require('./services/page'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('page', {
            abstract: true,
            url: '/page',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html'
                }
            }
        })
        .state('page.overview', {
            url: '/overview',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/pageOverview.html',
                    controller: 'PageOverviewCtrl'
                }
            }
        });
}]);