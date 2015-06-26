'use strict';

var app = require('angular').module('elyoosApp');

app.controller('PageCreateCtrl', require('./createEditPage/pageCreateCtrl'));
app.controller('PageEditCtrl', require('./createEditPage/pageEditCtrl'));
app.controller('PageSelectCategoryCtrl', require('./createEditPage/selectCategoryCtrl'));
app.controller('PageCommonSectionCtrl', require('./createEditPage/commonSectionCtrl'));
app.controller('PageCommonBookCtrl', require('./createEditPage/commonBookCtrl'));
app.controller('PageCommonYoutubeCtrl', require('./createEditPage/commonYoutubeCtrl'));
app.controller('UserRecommendationCtrl', require('./userRecommendation/userRecommendationCtrl'));
app.controller('GetPageAndExtendCtrl', require('./userRecommendation/getPageAndExtendCtrl'));
app.controller('UserPageAdministrationCtrl', require('./userPageAdministration/userPageAdministrationCtrl'));

app.controller('PageOverviewCtrl', require('./pageOverviewCtrl'));
app.controller('PageDetailCtrl', require('./pageDetail/pageDetailCtrl'));
app.controller('AddRemoveRecommendationCtrl', require('./addRemoveRecommendationCtrl'));

app.service('PageRecommendationAllContact', require('./services/pageRecommendationAllContact'));
app.service('PageRecommendationOtherUser', require('./services/pageRecommendationOtherUser'));
app.service('PageDetail', require('./services/pageDetail'));
app.service('SearchPage', require('./services/searchPage'));
app.service('PopularPages', require('./services/popularPages'));
app.service('PageCategories', require('./services/categories'));
app.service('PageUserRecommendation', require('./services/pageUserRecommendation'));
app.service('PageUserAdministration', require('./services/pageUserAdministration'));
app.service('PageSearchUserRecommendation', require('./services/pageSearchUserRecommendation'));
app.service('PageSearchUserAdministratedPage', require('./services/pageSearchUserAdministratedPage'));
app.service('PageLeftNavElements', require('./services/leftNavElements'));

app.service('PageDetailReview', require('./pageDetail/services/pageDetailReview'));

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
                    templateUrl: 'app/modules/page/pageOverview.html',
                    controller: 'PageOverviewCtrl'
                }
            },
            hasNavigation: true
        })
        .state('page.detail', {
            url: '/detail/{label}/{pageId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/pageDetail/pageDetail.html',
                    controller: 'PageDetailCtrl'
                }
            },
            hasNavigation: true
        })
        .state('page.edit', {
            url: '/edit/{label}/{pageId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/createEditPage/pageCreateEdit.html',
                    controller: 'PageEditCtrl'
                }
            },
            hasNavigation: true
        })
        .state('page.create', {
            url: '/create',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/createEditPage/pageCreateEdit.html',
                    controller: 'PageCreateCtrl'
                }
            },
            hasNavigation: true
        })
        .state('page.userRecommendation', {
            url: '/user/recommendation',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/userRecommendation/userRecommendation.html',
                    controller: 'UserRecommendationCtrl'
                }
            },
            hasNavigation: true
        })
        .state('page.userPageAdmin', {
            url: '/user/admin',
            views: {
                'content@': {
                    templateUrl: 'app/modules/page/userPageAdministration/userPageAdministration.html',
                    controller: 'UserPageAdministrationCtrl'
                }
            },
            hasNavigation: true
        });
}]);