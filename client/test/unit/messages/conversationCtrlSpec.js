'use strict';

var conversationCtrl = require('../../../app/modules/messages/conversationCtrl')[6];

describe('Tests of conversation controller', function () {
    var scope, rootScope, state, stateParams, Conversation, Message, dateFormatter;

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

            rootScope = $rootScope;
            scope = $rootScope.$new();
            done();
        });
    });

    it('Successful getting a thread of the user', function () {

        var stubMessageGet = sinon.stub(Message, 'get'),
            stubConversationGet = sinon.stub(Conversation, 'get');

        stubMessageGet.withArgs({itemsPerPage: 30, skip: 0}).returns('test2');
        stubConversationGet.withArgs({
            itemsPerPage: 30,
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

    it('Event refresh of message received and pagination is 1', function () {

        var stubMessageGet = sinon.stub(Message, 'get'),
            stubConversationGet = sinon.stub(Conversation, 'get');

        stubMessageGet.withArgs({itemsPerPage: 30, skip: 0}).returns('test2');
        stubConversationGet.withArgs({
            itemsPerPage: 30,
            skip: 0,
            threadId: '1',
            isGroupThread: 'false'
        }).returns('test');
        stateParams.threadId = '1';
        stateParams.isGroupThread = 'false';

        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);
        stubConversationGet.callArg(1);
        delete scope.thread;
        delete scope.threads;

        rootScope.$broadcast('message.changed');
        stubConversationGet.callArg(1);

        expect(scope.thread).to.equal('test');
        expect(scope.threads).to.equal('test2');
    });

    it('Event refresh of message received and pagination is 2. Only refresh threads', function () {

        var stubMessageGet = sinon.stub(Message, 'get'),
            stubConversationGet = sinon.stub(Conversation, 'get');

        stubMessageGet.withArgs({itemsPerPage: 30, skip: 0}).returns('test2');
        stubConversationGet.returns('test');
        stateParams.threadId = '1';
        stateParams.isGroupThread = 'false';

        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);
        scope.getThread(2);
        stubConversationGet.callArg(1);
        delete scope.thread;
        delete scope.threads;

        rootScope.$broadcast('message.changed');

        expect(scope.thread).to.be.undefined;
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

    it('Stay in the thread when to open thread is the current thread', function () {

        var mockStateGo = sinon.mock(state);

        stateParams.threadId = '1';
        stateParams.isGroupThread = 'false';

        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);

        mockStateGo.expects('go').never();
        scope.openThread('1', false);

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

    it('Raise the input height when scroll height has changed and is below 74px', function () {

        var event = {target: {offsetHeight: 73, scrollHeight: 73}};
        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);
        scope.checkHeightOfInput(event);


        expect(scope.textInputStyle.height).to.equal('75px');
        expect(scope.textInputWrapperStyle.height).to.equal('91px');
    });

    it('Do not raise input size when offsetHeight over 73px', function () {

        var event = {target: {offsetHeight: 74, scrollHeight: 73}};
        conversationCtrl(scope, state, stateParams, Conversation, Message, dateFormatter);
        scope.checkHeightOfInput(event);


        expect(scope.textInputStyle.height).to.be.undefined;
        expect(scope.textInputWrapperStyle.height).to.be.undefined;
    });
});