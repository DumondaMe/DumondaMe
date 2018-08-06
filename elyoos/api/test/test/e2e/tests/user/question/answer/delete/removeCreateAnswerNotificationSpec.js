'use strict';

const users = require('elyoos-server-test-util').user;
const db = require('elyoos-server-test-util').db;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Remove notification when user deletes an answers for a question', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });

        dbDsl.createQuestion('2', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü2', description: 'description2', topics: ['Spiritual'],
            language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Remove notification when book answer has been deleted', async function () {
        dbDsl.createBookAnswer('5', {
            creatorId: '1', questionId: '1', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.notificationCreateAnswer('50', {questionId: '1', answerId: '5', created: 678});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notification:Notification)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Remove notification when commitment answer has been deleted', async function () {
        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createCommitment('10', {
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });

        dbDsl.createCommitmentAnswer('5', {
            creatorId: '1', questionId: '1', commitmentId: '10', created: 555, description: 'test'
        });
        dbDsl.notificationCreateAnswer('50', {questionId: '1', answerId: '5', created: 678});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notification:Notification)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Remove notification when link answer has been deleted', async function () {
        dbDsl.createLinkAnswer('5', {
            creatorId: '1', questionId: '1', created: 555,
            link: 'https://example.com', pageType: 'blog'
        });
        dbDsl.notificationCreateAnswer('50', {questionId: '1', answerId: '5', created: 678});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notification:Notification)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Remove notification when text answer has been deleted', async function () {
        dbDsl.createTextAnswer('5', {
            creatorId: '1', questionId:'1', answer: 'Answer'
        });
        dbDsl.notificationCreateAnswer('50', {questionId: '1', answerId: '5', created: 678});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notification:Notification)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Remove notification when youtube answer has been deleted', async function () {
        dbDsl.createYoutubeAnswer('5', {
            creatorId: '1', questionId: '1', created: 555, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
        dbDsl.notificationCreateAnswer('50', {questionId: '1', answerId: '5', created: 678});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/', {answerId: '5'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notification:Notification)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });
});
