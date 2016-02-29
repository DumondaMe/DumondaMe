'use strict';

var app = angular.module('elyoosApp');

app.factory('Profile', require('./services/profile'));
app.factory('Privacy', require('./services/privacy'));
app.factory('Password', require('./services/password'));

app.service('GroupSettingsService', require('./services/groupSettingsService'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('settings', {
            abstract: true,
            url: '/settings'
        })
        .state('settings.profile', {
            url: '/profile',
            views: {
                'content@': {
                    templateUrl: 'app/modules/settings/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        })
        .state('settings.privacy', {
            url: '/privacy',
            views: {
                'content@': {
                    templateUrl: 'app/modules/settings/privacy.html',
                    controller: 'PrivacyCtrl'
                }
            }
        });
}]);