'use strict';

var app = require('angular').module('elyoosApp');

app.controller('ThreadsCtrl', require('./threadsCtrl'));
app.controller('ConversationCtrl', require('./conversationCtrl'));
app.controller('CreateConversationCtrl', require('./createConversationCtrl'));

app.factory('Message', require('./services/message'));
app.factory('Conversation', require('./services/conversation'));
app.factory('SearchUserToSendMessage', require('./services/searchUserToSendMessage'));

app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('message', {
            abstract: true,
            url: '/message',
            views: {
                header: {
                    templateUrl: 'app/modules/navigation/loggedInHeader.html'
                }
            }
        })
        .state('message.threads', {
            url: '/threads',
            views: {
                'content@': {
                    templateUrl: 'app/modules/messages/threads.html',
                    controller: 'ThreadsCtrl'
                }
            }
        })
        .state('message.threads.detail', {
            url: '/conversation/{isGroupThread}/{threadId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/messages/conversation.html',
                    controller: 'ConversationCtrl'
                }
            }
        })
        .state('message.threads.create', {
            url: '/single/create/{userId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/messages/conversation.html',
                    controller: 'CreateConversationCtrl'
                }
            }
        });
}]);