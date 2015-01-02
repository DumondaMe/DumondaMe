'use strict';

var app = require('angular').module('elyoosApp');

app.controller('MyContactCtrl', require('./myContactCtrl'));
app.controller('ContactPreviewCtrl', require('./contactPreviewCtrl'));
app.controller('DescriptionCounterCtrl', require('./descriptionCounterCtrl'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('contact', {
            abstract: true,
            url: '/contact',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html',
                    controller: 'PagesHeaderCtrl'
                }
            }
        })
        .state('contact.myContacts', {
            url: '/myContacts',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/myContact.html',
                    controller: 'MyContactCtrl'
                }
            }
        });
}]);