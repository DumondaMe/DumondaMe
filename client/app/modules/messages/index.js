'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('ThreadOverview', require('./services/thread'));
app.factory('SearchThread', require('./services/searchThread'));
app.factory('Conversation', require('./services/conversation'));
app.factory('SearchUserToSendMessage', require('./services/searchUserToSendMessage'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('message', {
            abstract: true,
            url: '/message'
        })
        .state('message.threads', {
            url: '/threads',
            views: {
                'content@': {
                    template: '<ely-messages></ely-messages>'
                }
            },
            data: {title: 'Nachrichten'}
        })
        .state('message.threads.detail', {
            url: '/conversation/{isGroupThread}/{threadId}',
            views: {
                'content@': {
                    template: '<ely-conversation></ely-conversation>'
                }
            },
            data: {hasBackNav: true, backNavToState: true}
        })
        .state('message.threads.create', {
            url: '/single/create/{userId}/{name}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/messages/conversation.html',
                    controller: 'CreateConversationCtrl'
                }
            }
        });
}]);