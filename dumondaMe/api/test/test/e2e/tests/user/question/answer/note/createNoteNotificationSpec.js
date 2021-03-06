'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const sinon = require('sinon');
const moment = require('moment');

describe('Notification when user creates a note for an answer', function () {

    let startTime, sandbox;

    beforeEach(async function () {
        await dbDsl.init(5);
        sandbox = sinon.sandbox.create();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Create notification when note for answer has been created', async function () {
        dbDsl.createDefaultAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/note', {answerId: '5', text: 'This is a note'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdNote'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .match(`(notification)-[:NOTIFICATION]->(note:Note)`)
            .return('DISTINCT notification, question, answer, note, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].question.questionId.should.equals('1');
        notification[0].answer.answerId.should.equals('5');
        notification[0].note.noteId.should.equals(res.body.noteId);
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Create notification for all users which have created a note', async function () {
        dbDsl.createDefaultAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });
        dbDsl.createNote('50', {answerId: '5', creatorId: '2', created: 555});
        dbDsl.createNote('51', {answerId: '5', creatorId: '3', created: 556});
        dbDsl.createNote('52', {answerId: '5', creatorId: '4', created: 557});
        dbDsl.createNote('53', {answerId: '5', creatorId: '4', created: 558});
        dbDsl.createNote('54', {answerId: '5', creatorId: '4', created: 558});
        dbDsl.createNote('55', {answerId: '5', creatorId: '1', created: 555});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question/answer/note', {answerId: '5', text: 'This is a note'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notified:User)<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'createdNote'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(originator)`)
            .match(`(notification)-[:NOTIFICATION]->(question:Question)`)
            .match(`(notification)-[:NOTIFICATION]->(answer:Answer)`)
            .match(`(notification)-[:NOTIFICATION]->(note:Note)`)
            .return('DISTINCT notification, question, answer, note, originator, notified')
            .orderBy('notified.userId DESC')
            .end().send();
        notification.length.should.equals(3);
        notification[0].notified.userId.should.equals('4');
        notification[1].notified.userId.should.equals('3');
        notification[2].notified.userId.should.equals('2');
    });

    it('No notification when note for answer has been created by creator of answer', async function () {
        dbDsl.createDefaultAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.post('/api/user/question/answer/note', {answerId: '5', text: 'This is a note'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(:User {userId: '2'})<-[:NOTIFIED]-
        (notification:Notification {type: 'createdAnswer'})`)
            .return('DISTINCT notification')
            .end().send();
        notification.length.should.equals(0);
    });
});
