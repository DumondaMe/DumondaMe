'use strict';

var threadsCtrl = require('../../../app/modules/home/homeCtrl')[2];

describe('Tests of home controller', function () {
    var scope, rootScope, Modification;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Modification = {};
            Modification.get = function () {
            };

            rootScope = $rootScope;
            scope = $rootScope.$new();
            done();
        });
    });

    it('Successful getting the modification state and show 1 new Message', function () {

        var stubMessageGet = sinon.stub(Modification, 'get'),
            response = {numberOfMessages: 1};

        stubMessageGet.withArgs({forceShowModification: true}).returns(response);

        threadsCtrl(scope, Modification);
        stubMessageGet.callArg(1);

        expect(scope.messageText).to.equal('1 neue Meldung');
    });

    it('Successful getting the modification state and show more then 1 new Message', function () {

        var stubMessageGet = sinon.stub(Modification, 'get'),
            response = {numberOfMessages: 2};

        stubMessageGet.withArgs({forceShowModification: true}).returns(response);

        threadsCtrl(scope, Modification);
        stubMessageGet.callArg(1);

        expect(scope.messageText).to.equal('2 neue Meldungen');
    });

    it('Successful getting the modification state and no new Message', function () {

        var stubMessageGet = sinon.stub(Modification, 'get'),
            response = {numberOfMessages: 0};

        stubMessageGet.withArgs({forceShowModification: true}).returns(response);

        threadsCtrl(scope, Modification);
        stubMessageGet.callArg(1);

        expect(scope.messageText).to.equal('');
    });

    it('Successful getting the modification state event and show 1 new Message', function () {

        threadsCtrl(scope, Modification);
        rootScope.$broadcast('message.changed', 1);

        expect(scope.messageText).to.equal('1 neue Meldung');
    });

    it('Successful getting the modification state event and show more then 1 new Message', function () {

        threadsCtrl(scope, Modification);
        rootScope.$broadcast('message.changed', 2);

        expect(scope.messageText).to.equal('2 neue Meldungen');
    });

    it('Successful getting the modification state event and no new Message', function () {

        threadsCtrl(scope, Modification);
        rootScope.$broadcast('message.changed', 0);

        expect(scope.messageText).to.equal('');
    });
});