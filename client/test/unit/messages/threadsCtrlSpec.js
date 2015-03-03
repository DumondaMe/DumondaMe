'use strict';

var threadsCtrl = require('../../../app/modules/messages/threadsCtrl')[4];

describe('Tests of threads controller', function () {
    var scope, rootScope, state, Message, dateFormatter;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Message = {};
            Message.get = function () {
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

        threadsCtrl(scope, state, Message, dateFormatter);

        expect(scope.threads).to.equal('test');
    });

    it('Open a thread', function () {

        var mockStateGo = sinon.mock(state);

        threadsCtrl(scope, state, Message, dateFormatter);

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

        threadsCtrl(scope, state, Message, dateFormatter);
        rootScope.$broadcast('message.changed');

        mockMessageGet.verify();
    });
});