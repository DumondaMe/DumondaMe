'use strict';

var threadsCtrl = require('../../../app/modules/messages/threadsCtrl')[2];

describe('Tests of threads controller', function () {
    var scope, Message;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Message = {};
            Message.get = function () {
            };

            scope = $rootScope.$new();
            done();
        });
    });

    it('Successful getting all threads of the user', function () {

        var stubMessageGet = sinon.stub(Message, 'get'),
            response = 'test';

        stubMessageGet.withArgs({itemsPerPage: 10, skip: 0}).returns(response);

        threadsCtrl(scope, Message);

        expect(scope.threads).to.equal('test');
    });
});