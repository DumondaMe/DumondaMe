'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();
const sinon = require('sinon');
const moment = require('moment');

describe('Remove notification when user deletes a note for an answer', function () {

    let startTime, sandbox;

    beforeEach(async function () {
        await dbDsl.init(5);
        sandbox = sinon.sandbox.create();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer'
        });
        dbDsl.createNote('50', {answerId: '5', creatorId: '1', created: 555});

        dbDsl.notificationCreateNote('100', {questionId: '1', answerId: '5', noteId: '50', created: 678});
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Delete notification when note for answer has been deleted', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/question/answer/note', {noteId: '50'});
        res.status.should.equal(200);

        let notification = await db.cypher().match(`(notification:Notification)`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });
});
