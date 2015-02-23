'use strict';

var threadsCtrl = require('../../../app/modules/messages/threadsCtrl')[4];

describe('Tests of threads controller', function () {
    var scope, state, Message, dateFormatter;

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

            scope = $rootScope.$new();
            done();
        });
    });

    it('Successful getting all threads of the user', function () {

        var stubMessageGet = sinon.stub(Message, 'get'),
            response = 'test';

        stubMessageGet.withArgs({itemsPerPage: 10, skip: 0}).returns(response);

        threadsCtrl(scope, state, Message, dateFormatter);

        expect(scope.threads).to.equal('test');
    });
});