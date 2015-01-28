'use strict';

var app = require('angular').module('elyoosApp');

app.controller('ProfileCtrl', require('./profileCtrl'));
app.controller('UploadFileCtrl', require('./uploadFileCtrl'));

app.factory('Profile', require('./profile'));

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
        .state('settings.security', {
            url: '/security',
            views: {
                'content@': {
                    templateUrl: 'app/modules/settings/security.html',
                    controller: 'ProfileCtrl'
                }
            }
        });
}]);