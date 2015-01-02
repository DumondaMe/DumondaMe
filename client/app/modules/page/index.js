'use strict';

var app = require('angular').module('elyoosApp');

app.controller('MyPagesCtrl', require('./myPagesCtrl'));
app.controller('MyPagesNewCtrl', require('./myPagesNewCtrl'));
app.controller('PagesHeaderCtrl', require('./headerCtrl'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('page', {
            abstract: true,
            url: '/page',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html',
                    controller: 'PagesHeaderCtrl'
                }
            }
        })
        .state('page.myPage', {
            url: '/myPages',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/myPage.html',
                    controller: 'MyPagesCtrl'
                }
            }
        })
        .state('page.myPage.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/myPageNew.html',
                    controller: 'MyPagesNewCtrl'
                }
            }
        })
        .state('page.search', {
            url: '/pageSearch',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/pageSearch.html',
                    controller: 'MyPagesCtrl'
                }
            }
        });
}]);