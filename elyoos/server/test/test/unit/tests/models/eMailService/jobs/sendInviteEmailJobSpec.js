'use strict';

let testee = require('../../../../../../../models/eMailService/jobs/sendInviteEmailJob');
let email = require('elyoos-server-lib').eMail;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test eMailService/jobs/sendInviteEmailJob', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        return dbDsl.init(6).then(function () {
            dbDsl.invitationSent('1', [{email: 'user8@irgendwo.ch'}, {email: 'user9@irgendwo.ch'}, {email: 'user10@irgendwo.ch'}]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Send invite emails to all email addresses in the list', function () {

        let finished = sinon.spy(), sendEMail = sandbox.stub(email, 'sendEMail');
        sendEMail.returns(true);
        return testee.processDefinition({
            userId: '1',
            name: 'user Meier'
        }, finished).then(function () {
            expect(sendEMail.callCount).to.equals(3);

            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1'}, 'user8@irgendwo.ch').calledOnce).to.equal(true);
            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1'}, 'user9@irgendwo.ch').calledOnce).to.equal(true);
            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1'}, 'user10@irgendwo.ch').calledOnce).to.equal(true);
            expect(finished.calledOnce).to.be.true;

            return db.cypher().match(`(user:InvitedUser)<-[:HAS_INVITED]-(:User {userId: '1'})`)
                .where("user.invitationSent = true").return("user")
                .end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(3);
        });
    });
});
