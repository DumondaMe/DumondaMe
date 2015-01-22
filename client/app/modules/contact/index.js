'use strict';

var app = require('angular').module('elyoosApp');

require('./contactPreview');

app.controller('MyContactCtrl', require('./myContactCtrl'));
app.controller('ContactingCtrl', require('./contactingCtrl'));
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
        })
        .state('contact.contacting', {
            url: '/contacting',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/contacting.html',
                    controller: 'ContactingCtrl'
                }
            }
        });
}]);