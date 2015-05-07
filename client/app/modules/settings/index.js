'use strict';

var app = require('angular').module('elyoosApp');

app.controller('ProfileCtrl', require('./profileCtrl'));
app.controller('PasswordCtrl', require('./passwordCtrl'));
app.controller('PrivacyCtrl', require('./privacyCtrl'));
app.controller('RenamePrivacyCtrl', require('./renamePrivacyCtrl'));
app.controller('DeletePrivacyCtrl', require('./deletePrivacyCtrl'));

app.factory('Profile', require('./services/profile'));
app.factory('Privacy', require('./services/privacy'));
app.factory('Password', require('./services/password'));

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
        .state('settings.profile.changePassword', {
            url: '/newPassword',
            views: {
                'content@': {
                    templateUrl: 'app/modules/settings/changePassword.html',
                    controller: 'PasswordCtrl'
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