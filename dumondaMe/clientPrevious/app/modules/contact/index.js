'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Contact', require('./services/contact'));
app.factory('ContactStatistic', require('./services/contactStatistic'));
app.factory('KnowUser', require('./services/knowUser'));
app.factory('UserDetail', require('./services/userDetail'));
app.factory('UserDetailContacts', require('./services/userDetailContacts'));
app.factory('UserDetailContactings', require('./services/userDetailContactings'));
app.factory('SearchUsers', require('./services/searchUsers'));
app.factory('Contacting', require('./services/contacting'));
app.factory('ContactRecommendation', require('./services/contactRecommendation'));

app.service('UserStateService', require('./services/userStateService'));
app.service('RecommendedContactScrollRequest', require('./services/scrollRequest'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('user', {
            abstract: true,
            url: '/user'
        })
        .state('user.detail', {
            url: '/details/{userId}',
            views: {
                'content@': {
                    template: '<ely-user-detail></ely-user-detail>'
                }
            },
            data: {hasBackNav: true, backNavToState: true}
        });
}]);