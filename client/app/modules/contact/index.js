'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Contact', require('./services/contact'));
app.factory('ContactStatistic', require('./services/contactStatistic'));
app.factory('ContactDetail', require('./services/contactDetail'));
app.factory('SearchUsers', require('./services/searchUsers'));
app.factory('Contacting', require('./services/contacting'));

app.service('ContactSuggestionSearch', require('./services/contactSuggestionSearch'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('contact', {
            abstract: true,
            url: '/contact'
        })
        .state('contact.overview', {
            url: '/overview',
            views: {
                'content@': {
                    template: '<ely-contact></ely-contact>'
                }
            },
            data: {hasSearch: true, searchServiceName: 'contact'}
        })
        .state('contact.contacting', {
            url: '/contacting',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/contacting.html',
                    controller: 'ContactingCtrl'
                }
            }
        })
        .state('contact.detail', {
            url: '/details/{userId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/contact/userDetail.html',
                    controller: 'DetailContactCtrl'
                }
            }
        });
}]);