'use strict';

var app = angular.module('elyoosApp');


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
                    templateUrl: 'app/modules/page/pageDetail/pageDetail.html',
                    controller: 'PageDetailCtrl'
                }
            }
        })
        .state('page.edit', {
            url: '/edit/{label}/{pageId}',
            views: {
                'content@': {
                    template: '<ely-page-handling-pages></ely-page-handling-pages>'
                }
            }
        })
        .state('page.create', {
            url: '/create',
            views: {
                'content@': {
                    template: '<ely-page-handling-pages></ely-page-handling-pages>'
                }
            }
        })
        .state('page.userRecommendation', {
            url: '/user/recommendation',
            views: {
                'content@': {
                    template: '<ely-page-user-recommendation></ely-page-user-recommendation>'
                }
            }
        })
        .state('page.userPageAdmin', {
            url: '/user/admin',
            views: {
                'content@': {
                    template: '<ely-page-user-administrator></ely-page-user-administrator>'
                }
            }
        });
}]);