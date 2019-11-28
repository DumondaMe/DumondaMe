'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const db = require('dumonda-me-server-test-util').db;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const testee = requireSrc('notifications');

describe('Send email when user has unread notification, new question', function () {

    let stubSendEMail, sandbox;

    beforeEach(async function () {
        await dbDsl.init(6);
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});

    });

    afterEach(function () {
        sandbox.restore();
    });

    it('User has one unread newQuestion notification (de)', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', topics: ['topic1'], language: 'de'
        });
        dbDsl.createContactConnection('2', '1');
        dbDsl.notificationUserCreatedQuestion({questionId: '1', created: 500});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'user Meier hat eine Frage gestellt',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });

    it('User has one unread newQuestion notification (en)', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'This is a questionöÖÄäÜü', topics: ['topic1'], language: 'de'
        });
        dbDsl.createContactConnection('2', '1');
        dbDsl.notificationUserCreatedQuestion({questionId: '1', created: 500});
        dbDsl.setUserLanguage('2', {language: 'en'});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'user Meier asked a question',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'en', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(1);
    });

    it('User has multiple unread newQuestion notification (de)', async function () {
        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü', topics: ['topic1'], language: 'de'
        });
        dbDsl.createQuestion('2', {
            creatorId: '1', question: 'Das ist eine FragöÖÄäÜü2', topics: ['topic1'], language: 'de'
        });
        dbDsl.createContactConnection('2', '1');
        dbDsl.notificationUserCreatedQuestion({questionId: '1', created: 500});
        dbDsl.notificationUserCreatedQuestion({questionId: '2', created: 500});
        await dbDsl.sendToDb();

        await testee.sendUnreadNotifications();

        stubSendEMail.calledWith("notification", {
            preview: sinon.match.any,
            title: 'user Meier hat eine Frage gestellt und weiteres',
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let notification = await db.cypher().match("(notification:Notification:EmailSent)")
            .return(`notification`).end().send();
        notification.length.should.equals(2);
    });
});
