'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const sinon = require('sinon');
const moment = require('moment');

describe('Notification when user creates commitment answer for a question', function () {

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

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createCommitment('10', {
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Engagement'
        });

        dbDsl.createCommitment('11', {
            adminId: '3', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example2.org/', regions: ['region-1'], title: 'Das ist ein Engagement2'
        });
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Create notification only for creator of question', async function () {
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

    it('Create notification for creator of question and user watching question', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '4'});
        dbDsl.watchQuestion({questionId: '1', userId: '5'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notifiedUser:User)<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .match(`(notification)-[:NOTIFICATION]->(commitment:Commitment)`)
            .return('DISTINCT notification, question, answer, commitment, user.userId AS userId, relNot.created AS created,' +
                'notifiedUser.userId AS notifiedUserId')
            .orderBy(`notifiedUserId`)
            .end().send();

        notification.length.should.equals(3);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].commitment.commitmentId.should.equals('10');
        notification[0].answer.description.should.equals('This is a commitment');
        notification[0].userId.should.equals('1');
        notification[0].notifiedUserId.should.equals('2');
        notification[0].created.should.least(startTime);

        should.exist(notification[1].notification.notificationId);
        notification[1].notification.created.should.least(startTime);
        notification[1].question.questionId.should.equals('1');
        notification[1].commitment.commitmentId.should.equals('10');
        notification[1].answer.description.should.equals('This is a commitment');
        notification[1].userId.should.equals('1');
        notification[1].notifiedUserId.should.equals('4');
        notification[1].created.should.least(startTime);

        should.exist(notification[2].notification.notificationId);
        notification[2].notification.created.should.least(startTime);
        notification[2].question.questionId.should.equals('1');
        notification[2].commitment.commitmentId.should.equals('10');
        notification[2].answer.description.should.equals('This is a commitment');
        notification[2].userId.should.equals('1');
        notification[2].notifiedUserId.should.equals('5');
        notification[2].created.should.least(startTime);
    });

    it('Create notification for users who list the creator of the question in their Trust Circle', async function () {
        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('4', '1');
        dbDsl.createContactConnection('5', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notifiedUser:User)<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .match(`(notification)-[:NOTIFICATION]->(commitment:Commitment)`)
            .return('DISTINCT notification, question, answer, commitment, user.userId AS userId, relNot.created AS created,' +
                'notifiedUser.userId AS notifiedUserId')
            .orderBy(`notifiedUserId`)
            .end().send();

        notification.length.should.equals(3);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].commitment.commitmentId.should.equals('10');
        notification[0].answer.description.should.equals('This is a commitment');
        notification[0].userId.should.equals('1');
        notification[0].notifiedUserId.should.equals('2');
        notification[0].created.should.least(startTime);

        should.exist(notification[1].notification.notificationId);
        notification[1].notification.created.should.least(startTime);
        notification[1].question.questionId.should.equals('1');
        notification[1].commitment.commitmentId.should.equals('10');
        notification[1].answer.description.should.equals('This is a commitment');
        notification[1].userId.should.equals('1');
        notification[1].notifiedUserId.should.equals('4');
        notification[1].created.should.least(startTime);

        should.exist(notification[2].notification.notificationId);
        notification[2].notification.created.should.least(startTime);
        notification[2].question.questionId.should.equals('1');
        notification[2].commitment.commitmentId.should.equals('10');
        notification[2].answer.description.should.equals('This is a commitment');
        notification[2].userId.should.equals('1');
        notification[2].notifiedUserId.should.equals('5');
        notification[2].created.should.least(startTime);
    });

    it('Create a notification only once when User follows a question and lists the creator of the answer in the Trust Cirlce.', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '4'});
        dbDsl.createContactConnection('4', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notifiedUser:User)<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .match(`(notification)-[:NOTIFICATION]->(commitment:Commitment)`)
            .return('DISTINCT notification, question, answer, commitment, user.userId AS userId, relNot.created AS created,' +
                'notifiedUser.userId AS notifiedUserId')
            .orderBy(`notifiedUserId`)
            .end().send();

        notification.length.should.equals(2);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].commitment.commitmentId.should.equals('10');
        notification[0].answer.description.should.equals('This is a commitment');
        notification[0].userId.should.equals('1');
        notification[0].notifiedUserId.should.equals('2');
        notification[0].created.should.least(startTime);

        should.exist(notification[1].notification.notificationId);
        notification[1].notification.created.should.least(startTime);
        notification[1].question.questionId.should.equals('1');
        notification[1].commitment.commitmentId.should.equals('10');
        notification[1].answer.description.should.equals('This is a commitment');
        notification[1].userId.should.equals('1');
        notification[1].notifiedUserId.should.equals('4');
        notification[1].created.should.least(startTime);
    });

    it('Create a notification only once when user created question and lists the creator of the answer in the Trust Cirlce.', async function () {
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/commitment/1', {
            commitmentId: '10', description: 'This is a commitment', language: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notifiedUser:User)<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdAnswer'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .match(`(notification)-[:NOTIFICATION]->(commitment:Commitment)`)
            .return('DISTINCT notification, question, answer, commitment, user.userId AS userId, relNot.created AS created,' +
                'notifiedUser.userId AS notifiedUserId')
            .orderBy(`notifiedUserId`)
            .end().send();

        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].commitment.commitmentId.should.equals('10');
        notification[0].answer.description.should.equals('This is a commitment');
        notification[0].userId.should.equals('1');
        notification[0].notifiedUserId.should.equals('2');
        notification[0].created.should.least(startTime);
    });

    it('Create no notification when commitment answer has been created by creator of question', async function () {
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
});
