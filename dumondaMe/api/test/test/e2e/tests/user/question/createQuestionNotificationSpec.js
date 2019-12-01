'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('When a new question is created, notifications should be created', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('The user who created the question has only been added to the Trust Circle by one person.', async function () {
        dbDsl.createContactConnection('2', '1');
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü',
            description: 'description',
            topics: ['topic1', 'topic2'],
            lang: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notifiedUser:User)<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'newQuestion'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(q:Question)`)
            .return('notification, q, user.userId AS userId, notifiedUser.userId AS notifiedUserId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].q.questionId.should.equals(res.body.questionId);
        notification[0].userId.should.equals('1');
        notification[0].notifiedUserId.should.equals('2');
        notification[0].created.should.least(startTime);
    });

    it('The user who created the question has been added by multiple persons to the Trust Circle', async function () {
        dbDsl.createContactConnection('2', '1');
        dbDsl.createContactConnection('4', '1');
        dbDsl.createContactConnection('5', '1');
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü',
            description: 'description',
            topics: ['topic1', 'topic2'],
            lang: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notifiedUser:User)<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'newQuestion'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(q:Question)`)
            .return('notification, q, user.userId AS userId, notifiedUser.userId AS notifiedUserId, relNot.created AS created')
            .orderBy(`notifiedUserId`)
            .end().send();
        notification.length.should.equals(3);
        notification[0].q.questionId.should.equals(res.body.questionId);
        should.exist(notification[0].notification.notificationId);
        notification[0].userId.should.equals('1');
        notification[0].notifiedUserId.should.equals('2');

        notification[1].q.questionId.should.equals(res.body.questionId);
        notification[1].notification.notificationId.should.not.equals(notification[0].notification.notificationId);
        notification[1].notification.notificationId.should.not.equals(notification[2].notification.notificationId);
        notification[1].userId.should.equals('1');
        notification[1].notifiedUserId.should.equals('4');

        notification[2].q.questionId.should.equals(res.body.questionId);
        notification[2].notification.notificationId.should.not.equals(notification[0].notification.notificationId);
        notification[2].notification.notificationId.should.not.equals(notification[1].notification.notificationId);
        notification[2].userId.should.equals('1');
        notification[2].notifiedUserId.should.equals('5');
    });

    it('The user who created the question has not been added to the Trust Circle by an other person.', async function () {
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/question', {
            question: 'Das ist eine FragöÖÄäÜü',
            description: 'description',
            topics: ['topic1', 'topic2'],
            lang: 'de'
        });
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notifiedUser:User)<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'newQuestion'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .match(`(notification)-[:NOTIFICATION]->(q:Question)`)
            .return('notification, q, user.userId AS userId, notifiedUser.user AS notifiedUserId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(0);
    });
});
