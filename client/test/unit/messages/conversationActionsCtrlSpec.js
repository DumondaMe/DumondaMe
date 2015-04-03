'use strict';

var conversationCtrl = require('../../../app/modules/messages/conversationActionsCtrl')[4];

describe('Tests of conversation actions controller', function () {
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
            scope.settings = {};
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
            isGroupThread: false
        }).returns('test');
        scope.settings.itemsPerPage = 30;
        scope.settings.selectedThreadId = '1';
        scope.settings.getThreadAtInit = true;
        scope.settings.selectedIsGroupThread = false;
        scope.settings.currentPagination = 1;

        conversationCtrl(scope, state, Message, Conversation);

        stubConversationGet.callArg(1);

        expect(scope.settings.thread).to.equal('test');
        expect(scope.settings.threads).to.equal('test2');
    });

    it('To getting the thread of a user when getThreadAtInit is false', function () {

        var stubMessageGet = sinon.stub(Message, 'get'),
            stubConversationGet = sinon.stub(Conversation, 'get');

        stubMessageGet.withArgs({itemsPerPage: 30, skip: 0}).returns('test2');
        stubConversationGet.withArgs({
            itemsPerPage: 30,
            skip: 0,
            threadId: '1',
            isGroupThread: false
        }).returns('test');
        scope.settings.itemsPerPage = 30;
        scope.settings.selectedThreadId = '1';
        scope.settings.getThreadAtInit = false;
        scope.settings.selectedIsGroupThread = false;
        scope.settings.currentPagination = 1;

        conversationCtrl(scope, state, Message, Conversation);

        expect(stubConversationGet.called).to.be.false;
    });

    it('Switch to another thread', function () {

        var mockStateGo = sinon.mock(state);

        scope.settings.selectedThreadId = '1';
        scope.settings.selectedIsGroupThread = false;

        conversationCtrl(scope, state, Message, Conversation);

        mockStateGo.expects('go').withArgs('message.threads.detail', {
            threadId: '2',
            isGroupThread: true
        });
        scope.settings.openThread('2', true);

        mockStateGo.verify();
    });

    it('Stay in the thread when to open thread is the current thread', function () {

        var mockStateGo = sinon.mock(state);

        scope.settings.selectedThreadId = '1';
        scope.settings.selectedIsGroupThread = false;

        conversationCtrl(scope, state, Message, Conversation);

        mockStateGo.expects('go').never();
        scope.settings.openThread('1', false);

        mockStateGo.verify();
    });

    it('Raise the input height when scroll height has changed and is below 74px', function () {

        var event = {target: {offsetHeight: 73, scrollHeight: 73}};
        conversationCtrl(scope, state, Message, Conversation);
        scope.settings.checkHeightOfInput(event);


        expect(scope.settings.textInputStyle.height).to.equal('75px');
        expect(scope.settings.textInputWrapperStyle.height).to.equal('91px');
    });

    it('Do not raise input size when offsetHeight over 73px', function () {

        var event = {target: {offsetHeight: 74, scrollHeight: 73}};
        scope.settings.textInputStyle = {};
        scope.settings.textInputWrapperStyle = {};
        conversationCtrl(scope, state, Message, Conversation);
        scope.settings.checkHeightOfInput(event);

        expect(scope.settings.textInputStyle.height).to.be.undefined;
        expect(scope.settings.textInputWrapperStyle.height).to.be.undefined;
    });

    it('Reset the text textInputStyle', function () {

        var event = {target: {offsetHeight: 74, scrollHeight: 73}};
        scope.settings.textInputStyle = {height: 1};
        scope.settings.textInputWrapperStyle = {height: 1};
        conversationCtrl(scope, state, Message, Conversation);
        scope.settings.resetTextInputStyle(event);

        expect(scope.settings.textInputStyle.height).to.be.undefined;
        expect(scope.settings.textInputWrapperStyle.height).to.be.undefined;
    });
});