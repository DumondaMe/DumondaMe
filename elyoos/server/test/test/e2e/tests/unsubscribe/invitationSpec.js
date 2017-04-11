'use strict';

let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for unsubscribe invitation messages', function () {

    beforeEach(function () {
        return dbDsl.init(1).then(function () {
            dbDsl.invitationSentBeforeRegistration('1', [{email: 'userIrgendwas@elyoos.org', invitationSent: 500}]);
            return dbDsl.sendToDb();
        });
    });

    it('Unsubscribe email invitation', function () {

        return requestHandler.post('/api/unsubscribe/invitation', {email: 'userIrgendwas@elyoos.org'}).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(unsubscribe:UnsubscribeInvitation {email: 'userIrgendwas@elyoos.org'})")
                .return('unsubscribe').end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            return requestHandler.post('/api/unsubscribe/invitation', {email: 'userIrgendwas@elyoos.org'});
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(unsubscribe:UnsubscribeInvitation {email: 'userIrgendwas@elyoos.org'})")
                .return('unsubscribe').end().send();
        }).then(function (user) {
            user.length.should.equals(1);
        });
    });
});
