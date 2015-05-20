'use strict';

var conversationCtrl = require('../../../app/modules/messages/createConversationCtrl')[6];

describe('Tests of create conversation controller', function () {
    var scope, state, stateParams, Conversation, Message, MessageLeftNavElements;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            MessageLeftNavElements = {};
            Conversation = {};
            Conversation.get = function () {
            };
            Conversation.save = function () {
            };

            Message = {};
            Message.get = function () {
            };

            state = {};
            state.go = function () {
            };

            stateParams = {};
            scope = $rootScope.$new();
            done();
        });
    });

    it('Crate a new single thread', function () {

        var mockConversation = sinon.mock(Conversation), expectation, resp;

        resp = {message: {test: 'test'}};

        stateParams.userId = '1';

        conversationCtrl(scope, state, stateParams, Conversation, Message, MessageLeftNavElements);
        scope.settings.newMessage = 'test';

        expectation = mockConversation.expects('save');
        expectation.withArgs({newSingleThread: {contactId: '1', text: 'test'}});
        scope.sendMessage();

        mockConversation.verify();
        expectation.callArgWith(1, resp);
    });

    it('Empty message is not allowed to send', function () {

        var mockConversation = sinon.mock(Conversation), expectation;

        stateParams.userId = '1';

        conversationCtrl(scope, state, stateParams, Conversation, Message, MessageLeftNavElements);
        scope.settings.newMessage = '  ';

        expectation = mockConversation.expects('save');
        expectation.never();
        scope.sendMessage();

        mockConversation.verify();
    });
});