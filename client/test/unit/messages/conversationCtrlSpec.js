'use strict';

var conversationCtrl = require('../../../app/modules/messages/conversationCtrl')[6];

describe('Tests of conversation controller', function () {
    var scope, rootScope, stateParams, Conversation, Message, dateFormatter, MessageLeftNavElements;

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

            stateParams = {};
            MessageLeftNavElements = {};

            rootScope = $rootScope;
            scope = $rootScope.$new();
            done();
        });
    });

    it('Event refresh of message received and pagination is 1', function () {

        var stubGetThread;

        conversationCtrl(scope, stateParams, Conversation, Message, dateFormatter, MessageLeftNavElements);
        scope.settings.getThread = function () {
        };
        stubGetThread = sinon.stub(scope.settings, 'getThread');

        rootScope.$broadcast('message.changed');

        expect(stubGetThread.calledWith(1)).to.be.true;
    });

    it('Event refresh of message received and pagination is 2. Only refresh threads', function () {

        var stubMessageGet = sinon.stub(Message, 'get');

        conversationCtrl(scope, stateParams, Conversation, Message, dateFormatter, MessageLeftNavElements);
        scope.settings.currentPagination = 2;

        rootScope.$broadcast('message.changed');

        expect(stubMessageGet.calledWith({itemsPerPage: 30, skip: 0})).to.be.true;
    });

    it('Sending a message to a single thread', function () {

        var mockConversation = sinon.mock(Conversation), expectation, resp;

        resp = {message: {test: 'test'}};

        conversationCtrl(scope, stateParams, Conversation, Message, dateFormatter, MessageLeftNavElements);
        scope.settings.selectedThreadId = '1';
        scope.settings.selectedIsGroupThread = false;
        scope.settings.thread = {messages: []};
        scope.settings.newMessage = 'test';
        scope.settings.resetTextInputStyle = function () {
        };

        expectation = mockConversation.expects('save');
        expectation.withArgs({addMessage: {threadId: '1', text: 'test'}});
        scope.sendMessage();

        mockConversation.verify();
        expectation.callArgWith(1, resp);
        expect(scope.settings.thread.messages.length).to.equal(1);
        expect(scope.settings.thread.messages[0].test).to.equal('test');
    });

    it('Sending a message to a group thread', function () {

        var mockConversation = sinon.mock(Conversation), expectation, resp;

        resp = {message: {test: 'test'}};

        conversationCtrl(scope, stateParams, Conversation, Message, dateFormatter, MessageLeftNavElements);
        scope.settings.selectedThreadId = '1';
        scope.settings.selectedIsGroupThread = true;
        scope.settings.thread = {messages: []};
        scope.settings.newMessage = 'test';
        scope.settings.resetTextInputStyle = function () {
        };

        expectation = mockConversation.expects('save');
        expectation.withArgs({addGroupMessage: {threadId: '1', text: 'test'}});
        scope.sendMessage();

        mockConversation.verify();
        expectation.callArgWith(1, resp);
        expect(scope.settings.thread.messages.length).to.equal(1);
        expect(scope.settings.thread.messages[0].test).to.equal('test');
    });

    it('Empty message is not allowed to send', function () {

        var mockConversation = sinon.mock(Conversation), expectation;

        conversationCtrl(scope, stateParams, Conversation, Message, dateFormatter, MessageLeftNavElements);
        scope.settings.selectedThreadId = '1';
        scope.settings.selectedIsGroupThread = false;
        scope.settings.thread = {messages: []};
        scope.settings.newMessage = '  ';
        scope.settings.resetTextInputStyle = function () {
        };

        expectation = mockConversation.expects('save');
        expectation.never();
        scope.sendMessage();

        mockConversation.verify();
    });
});