'use strict';

var app = require('angular').module('elyoosApp');

app.controller('ProfileCtrl', require('./profileCtrl'));
app.controller('PrivacyCtrl', require('./privacyCtrl'));

app.factory('Profile', require('./profile'));
app.factory('Privacy', require('./privacy'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('settings', {
            abstract: true,
            url: '/settings',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html'
                }
            }
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