'use strict';

var conversationCtrl = require('../../../app/modules/messages/conversationCtrl')[6];

describe('Tests of conversation controller', function () {
    var scope, state, stateParams, Conversation, Message, dateFormatter;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Conversation = {};
            Conversation.get = function () {
            };
            Conversation.save = function () {
            };

            Message = {};
            Message.get = function () {
            };

            dateFormatter = {};
            dateFormatter.formatExact = function () {
            };

            state = {};
            state.go = function () {
            };

            stateParams = {};

            scope = $rootScope.$new();
            done();
        });
    });

    it('Successful getting a thread of the user', function () {

        var stubMessageGet = sinon.stub(Message, 'get'),
            stubConversationGet = sinon.stub(Conversation, 'get');

        stubMessageGet.withArgs({itemsPerPage: 10, skip: 0}).returns('test2');
        stubConversationGet.withArgs({
            itemsPerPage: 10,
            skip: 0,
            threadId: '1',
            isGroupThread: 'false'
        }).returns('test');
        stateParams.threadId = '1';
        stateParams.isGroupThread = 'false';

        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);

        stubConversationGet.callArg(1);

        expect(scope.thread).to.equal('test');
        expect(scope.threads).to.equal('test2');
    });

    it('Switch to another thread', function () {

        var mockStateGo = sinon.mock(state);

        stateParams.threadId = '1';
        stateParams.isGroupThread = 'false';

        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);

        mockStateGo.expects('go').withArgs('message.threads.detail', {
            threadId: '2',
            isGroupThread: true
        });
        scope.openThread('2', true);

        mockStateGo.verify();
    });

    it('Sending a message to a single thread', function () {

        var mockConversation = sinon.mock(Conversation), expectation, resp;

        resp = {message: {test: 'test'}};

        stateParams.threadId = '1';
        stateParams.isGroupThread = 'false';

        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);
        scope.thread = {messages: []};
        scope.newMessage = 'test';

        expectation = mockConversation.expects('save');
        expectation.withArgs({addMessage: {threadId: '1', text: 'test'}});
        scope.sendMessage();

        mockConversation.verify();
        expectation.callArgWith(1, resp);
        expect(scope.thread.messages.length).to.equal(1);
        expect(scope.thread.messages[0].test).to.equal('test');
    });

    it('Sending a message to a group thread', function () {

        var mockConversation = sinon.mock(Conversation), expectation, resp;

        resp = {message: {test: 'test'}};

        stateParams.threadId = '1';
        stateParams.isGroupThread = 'true';

        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);
        scope.thread = {messages: []};
        scope.newMessage = 'test';

        expectation = mockConversation.expects('save');
        expectation.withArgs({addGroupMessage: {threadId: '1', text: 'test'}});
        scope.sendMessage();

        mockConversation.verify();
        expectation.callArgWith(1, resp);
        expect(scope.thread.messages.length).to.equal(1);
        expect(scope.thread.messages[0].test).to.equal('test');
    });

    it('Empty message is not allowed to send', function () {

        var mockConversation = sinon.mock(Conversation), expectation;

        stateParams.threadId = '1';
        stateParams.isGroupThread = 'false';
        scope.newMessage = '  ';

        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);
        scope.thread = {messages: []};

        expectation = mockConversation.expects('save');
        expectation.never();
        scope.sendMessage();

        mockConversation.verify();
    });
});