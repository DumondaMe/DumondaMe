'use strict';

var threadsCtrl = require('../../../app/modules/messages/threadsCtrl')[5];

describe('Tests of threads controller', function () {
    var scope, rootScope, state, Message, SearchUserToSendMessage, dateFormatter;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Message = {};
            Message.get = function () {
            };

            SearchUserToSendMessage = {};
            SearchUserToSendMessage.get = function () {
            };
            SearchUserToSendMessage.query = function () {
            };

            dateFormatter = {};
            dateFormatter.format = function () {
            };

            state = {};
            state.go = function () {
            };

            rootScope = $rootScope;
            scope = $rootScope.$new();
            done();
        });
    });

    it('Successful getting all threads of the user', function () {

        var stubMessageGet = sinon.stub(Message, 'get'),
            response = 'test';

        stubMessageGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);

        threadsCtrl(scope, state, Message, SearchUserToSendMessage, dateFormatter);

        expect(scope.threads).to.equal('test');
    });

    it('Open a thread', function () {

        var mockStateGo = sinon.mock(state);

        threadsCtrl(scope, state, Message, SearchUserToSendMessage, dateFormatter);

        mockStateGo.expects('go').withArgs('message.threads.detail', {
            threadId: '1',
            isGroupThread: true
        });
        scope.openThread('1', true);

        mockStateGo.verify();
    });

    it('Refresh the thread', function () {

        var mockMessageGet = sinon.mock(Message);

        mockMessageGet.expects('get').withArgs({itemsPerPage: 30, skip: 0}).twice();

        threadsCtrl(scope, state, Message, SearchUserToSendMessage, dateFormatter);
        rootScope.$broadcast('message.changed');

        mockMessageGet.verify();
    });

    it('Getting thread suggestion', function () {

        var mockSearchUser = sinon.mock(SearchUserToSendMessage),
            searchQuery = 'R';

        mockSearchUser.expects('query').withArgs({
            search: searchQuery,
            maxItems: 7,
            isSuggestion: true
        }).returns({$promise: 1});

        threadsCtrl(scope, state, Message, SearchUserToSendMessage, dateFormatter);
        scope.getSuggestion(searchQuery);

        mockSearchUser.verify();
    });

    it('If the suggestion string is empty then delete the search thread', function () {

        var mockSearchUser = sinon.mock(SearchUserToSendMessage),
            searchQuery = ' ';

        mockSearchUser.expects('query').never();

        threadsCtrl(scope, state, Message, SearchUserToSendMessage, dateFormatter);
        scope.getSuggestion(searchQuery);

        mockSearchUser.verify();
    });

    it('Search for threads and contacts', function () {

        var mockSearchUser = sinon.mock(SearchUserToSendMessage),
            searchQuery = 'R';

        mockSearchUser.expects('get').withArgs({
            search: searchQuery,
            maxItems: 20,
            isSuggestion: false
        }).returns({});

        threadsCtrl(scope, state, Message, SearchUserToSendMessage, dateFormatter);
        scope.getThreadsOrContacts(searchQuery);

        mockSearchUser.verify();
    });

    it('Search is not started for threads and contacts with empty string', function () {

        var mockSearchUser = sinon.mock(SearchUserToSendMessage),
            searchQuery = '  ';

        mockSearchUser.expects('get').never();

        threadsCtrl(scope, state, Message, SearchUserToSendMessage, dateFormatter);
        scope.getThreadsOrContacts(searchQuery);

        mockSearchUser.verify();
    });
});