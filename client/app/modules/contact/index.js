'use strict';

var app = angular.module('elyoosApp');

require('./contactPreview');

app.controller('MyContactCtrl', require('./myContactCtrl'));
app.controller('DetailContactCtrl', require('./detailContactCtrl'));
app.controller('ContactingCtrl', require('./contactingCtrl'));
app.controller('DescriptionCounterCtrl', require('./descriptionCounterCtrl'));


app.factory('Contact', require('./services/contact'));
app.factory('ContactDetail', require('./services/contactDetail'));
app.factory('SearchUsers', require('./services/searchUsers'));
app.factory('Contacting', require('./services/contacting'));

app.service('ContactUserActions', require('./services/userActions'));
app.service('ContactLeftNavElements', require('./services/leftNavElements'));

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
            },
            hasNavigation: true
        })
        .state('contact.contacting', {
            url: '/contacting',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/contacting.html',
                    controller: 'ContactingCtrl'
                }
            },
            hasNavigation: true
        })
        .state('contact.detail', {
            url: '/details/{userId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/userDetail.html',
                    controller: 'DetailContactCtrl'
                }
            },
            hasNavigation: true
        });
}]);