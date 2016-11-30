'use strict';

var app = angular.module('elyoosApp');

app.factory('Profile', require('./services/profile'));
app.factory('Privacy', require('./services/privacy'));
app.factory('Password', require('./services/password'));
app.factory('UserPinwall', require('./services/userPinwall'));
app.factory('RecommendedUserOnHomeSetting', require('./services/recommendedUserOnHome'));

app.service('GroupSettingsService', require('./services/groupSettingsService'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('settings', {
            abstract: true,
            url: '/settings',
            data: {title: 'Dein Profil'}
        })
        .state('settings.profile', {
            url: '/profile',
            views: {
                'content@': {
                    template: '<ely-settings-profile></ely-settings-profile>'
                }
            }
        });
}]);