'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const rp = require('request');
const sinon = require('sinon');
const moment = require('moment');

describe('Notification when user creates answers for a question', function () {

    let startTime, sandbox;

    beforeEach(async function () {
        await dbDsl.init(5);
        sandbox = sinon.sandbox.create();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

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
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Create notification when book answer has been created', async function () {
        sandbox.stub(rp, 'get');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234',
            title: 'titleBook', description: 'descriptionBook'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .return('DISTINCT notification, question, answer, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].answer.title.should.equals('titleBook');
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Create notification when commitment answer has been created', async function () {
        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createCommitment('10', {
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });

        dbDsl.createCommitment('11', {
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example2.org/', regions: ['region-1'], title: 'Das ist ein Engagement2'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .match(`(notification)-[:NOTIFICATION]->(commitment:Commitment)`)
            .return('DISTINCT notification, question, answer, commitment, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].answer.description.should.equals('This is a commitment');
        notification[0].commitment.commitmentId.should.equals('10');
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Create notification when link answer has been created', async function () {
        sandbox.stub(rp, 'get');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            link: 'https://example.com/blog', imageUrl: 'https://example.com/example.jpg',
            title: 'titleLink', description: 'descriptionLink', type: 'blog'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .return('DISTINCT notification, question, answer, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].answer.title.should.equals('titleLink');
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Create notification when text answer has been created', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .return('DISTINCT notification, question, answer, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].answer.answer.should.equals('answer');
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Create notification when youtube answer has been created', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .return('DISTINCT notification, question, answer, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].answer.title.should.equals('titleYoutube');
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Create no notification when book answer has been created by creator of question', async function () {
        sandbox.stub(rp, 'get');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.post('/api/user/question/answer/book/1', {
            authors: 'Hans Wurst', googleBookId: '1234',
            title: 'titleBook', description: 'descriptionBook'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'createdAnswer'})`)
            .return('DISTINCT notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Create no notification when commitment answer has been created by creator of question', async function () {
        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createCommitment('10', {
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });

        dbDsl.createCommitment('11', {
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example2.org/', regions: ['region-1'], title: 'Das ist ein Engagement2'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .match(`(notification)-[:NOTIFICATION]->(commitment:Commitment)`)
            .return('DISTINCT notification, question, answer, commitment, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Create no notification when link answer has been created by creator of question', async function () {
        sandbox.stub(rp, 'get');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.post('/api/user/question/answer/link/1', {
            link: 'https://example.com/blog', imageUrl: 'https://example.com/example.jpg',
            title: 'titleLink', description: 'descriptionLink', type: 'blog'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .return('DISTINCT notification, question, answer, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Create no notification when text answer has been created by creator of question', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.post('/api/user/question/answer/default/1', {
            answer: 'answer'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .return('DISTINCT notification, question, answer, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Create no notification when youtube answer has been created by creator of question', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.post('/api/user/question/answer/youtube/1', {
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8',
            title: 'titleYoutube', description: 'descriptionYoutube'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .return('DISTINCT notification, question, answer, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(0);
    });
});
