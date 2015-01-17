'use strict';

var app = require('angular').module('elyoosApp');

app.controller('MyContactCtrl', require('./myContactCtrl'));
app.controller('ContactPreviewCtrl', require('./contactPreviewCtrl'));
app.controller('DescriptionCounterCtrl', require('./descriptionCounterCtrl'));


app.factory('Contact', require('./contact'));
app.factory('SearchUsers', require('./searchUsers'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('contact', {
            abstract: true,
            url: '/contact',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html'
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