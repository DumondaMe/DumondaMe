'use strict';

let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;

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
            return db.cypher().match("(unsubscribe:UnsubscribeInvitation)")
                .return('unsubscribe').end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].unsubscribe.email.should.equals('userirgendwas@elyoos.org');
            return requestHandler.post('/api/unsubscribe/invitation', {email: 'userIRGendwas@elyoos.org'});
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(unsubscribe:UnsubscribeInvitation)")
                .return('unsubscribe').end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].unsubscribe.email.should.equals('userirgendwas@elyoos.org');
        });
    });
});
