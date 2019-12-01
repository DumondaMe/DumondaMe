'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const eMail = require('dumonda-me-server-lib').eMail;
const sinon = require('sinon');
const moment = require('moment');
const fs = require('fs');
const tmp = require('tmp');

describe('Ask registered user to answer question', function () {

    let startTime, sandbox, stubSendEMail;

    beforeEach(async function () {
        let stubFileSync;
        await dbDsl.init(4);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});
        stubFileSync = sandbox.stub(tmp, 'fileSync');
        stubFileSync.returns({name: 'test', Body: 'test'});
        sandbox.stub(fs, 'writeFileSync');

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('10', {
            creatorId: '4', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Send invitation to user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite', {
            questionId: '10', userIds: ['3']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/answerQuestion/user3@irgendwo.ch`
        }, 'de', 'user3@irgendwo.ch').should.be.true;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:User {userId: '3'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(1);
    });

    it('Send invitation for other question to user is allowed', async function () {
        dbDsl.createQuestion('11', {
            creatorId: '1', question: 'Das ist eine Frage2', topics: ['topic1'], language: 'de'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite', {
            questionId: '10', userIds: ['3']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/answerQuestion/user3@irgendwo.ch`
        }, 'de', 'user3@irgendwo.ch').should.be.true;
        stubSendEMail.resetHistory();

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:User {userId: '3'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(1);

        res = await requestHandler.put('/api/user/question/invite', {
            questionId: '11', userIds: ['3']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage2', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/11/das-ist-eine-frage2`,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/answerQuestion/user3@irgendwo.ch`
        }, 'de', 'user3@irgendwo.ch').should.be.true;

        resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:User {userId: '3'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '11'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(1);
    });

    it('Send invitation to multiple registered user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite', {
            questionId: '10', userIds: ['3', '2']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/answerQuestion/user3@irgendwo.ch`
        }, 'de', 'user3@irgendwo.ch').should.be.true;

        stubSendEMail.calledWith("askRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/answerQuestion/user2@irgendwo.ch`
        }, 'de', 'user2@irgendwo.ch').should.be.true;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})")
            .with(`asked`)
            .match(`(asked)-[:ASKED]->(user:User)`)
            .return(`DISTINCT asked, collect(user) AS Users`).end().send();
        resp.length.should.equals(1);
    });

    it('Send invitation to registered user for a question only once', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite', {
            questionId: '10', userIds: ['3']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`,
            unsubscribeLink: `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/answerQuestion/user3@irgendwo.ch`
        }, 'de', 'user3@irgendwo.ch').should.be.true;
        stubSendEMail.resetHistory();

        res = await requestHandler.put('/api/user/question/invite', {
            questionId: '10', userIds: ['3']
        });
        res.status.should.equal(200);
        stubSendEMail.called.should.be.false;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:User {userId: '3'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(1);
    });

    it('Do not send invitation if email notification is disabled', async function () {
        dbDsl.disableEMailNotification('3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite', {
            questionId: '10', userIds: ['3']
        });
        res.status.should.equal(200);

        stubSendEMail.called.should.be.false;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:User {userId: '3'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(0);
    });

    it('Not allowed to send invitation to administrator of question', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite', {
            questionId: '10', userIds: ['4']
        });
        res.status.should.equal(200);

        stubSendEMail.called.should.be.false;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:User {userId: '3'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(0);
    });

    it('Not allowed to send invitation to user who has answered question', async function () {
        dbDsl.createBookAnswer('5', {
            creatorId: '2', questionId: '10', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite', {
            questionId: '10', userIds: ['2']
        });
        res.status.should.equal(200);

        stubSendEMail.called.should.be.false;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:User {userId: '3'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(0);
    });
});
