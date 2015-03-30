'use strict';

var message = require('../../../../app/modules/messages/services/message')[1];
var conversation = require('../../../../app/modules/messages/services/conversation')[1];
var searchUserToSendMessage = require('../../../../app/modules/messages/services/searchUserToSendMessage')[1];
var searchThread = require('../../../../app/modules/messages/services/searchThread')[1];

describe('Tests all services of messages for http requests', function () {
    var resource;

    beforeEach(function (done) {
        angular.mock.module('ngResource');
        inject(function ($resource) {
            resource = $resource;
            done();
        });
    });

    it('Load Message', function () {
        message(resource);
    });

    it('Load Conversation', function () {
        conversation(resource);
    });

    it('Load SearchUserToSendMessage', function () {
        searchUserToSendMessage(resource);
    });

    it('Load Search Thread', function () {
        searchThread(resource);
    });
});