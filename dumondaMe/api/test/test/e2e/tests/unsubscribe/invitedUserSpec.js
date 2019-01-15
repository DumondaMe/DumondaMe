'use strict';

let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Unsubscribe invited users', function () {

    beforeEach(function () {
        return dbDsl.init(2).then(function () {
            dbDsl.invitationSentBeforeRegistration('1', [{emailOfUserToInvite: 'user.irgendwas@dumonda.me'},
                {emailOfUserToInvite: 'user.2irgendwas@dumonda.me'}]);
            dbDsl.invitationSentBeforeRegistration('2', [{emailOfUserToInvite: 'user.irgendwas@dumonda.me'}]);
            return dbDsl.sendToDb();
        });
    });

    it('Unsubscribe invited user', async function () {

        let res = await requestHandler.post('/api/unsubscribe/invitedUser', {email: 'user.irgendwas@dumonda.me'});
        res.status.should.equal(200);

        let user = await db.cypher().match("(invitedUser:InvitedUser {emailNormalized: 'user.irgendwas@dumonda.me'})")
            .where(`NOT invitedUser:EMailNotificationEnabled`)
            .return('invitedUser').end().send();
        user.length.should.equals(1);
    });

    it('Unsubscribe invited user (upper case)', async function () {

        let res = await requestHandler.post('/api/unsubscribe/invitedUser', {email: 'USER.irgendwas@dumonda.me'});
        res.status.should.equal(200);

        let user = await db.cypher().match("(invitedUser:InvitedUser {emailNormalized: 'user.irgendwas@dumonda.me'})")
            .where(`NOT invitedUser:EMailNotificationEnabled`)
            .return('invitedUser').end().send();
        user.length.should.equals(1);
    });
});
