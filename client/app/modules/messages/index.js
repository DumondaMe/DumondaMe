'use strict';

var app = require('angular').module('elyoosApp');

app.controller('ThreadsCtrl', require('./threadsCtrl'));
app.controller('DetailThreadsCtrl', require('./detailThreadsCtrl'));

app.factory('Message', require('./services/message'));
app.factory('SingleThread', require('./services/singleThread'));

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
            url: '/conversation/{threadId}',
            views: {
                'content@': {
                    templateUrl: 'app/modules/messages/detailThreads.html',
                    controller: 'DetailThreadsCtrl'
                }
            }
        });
}]);