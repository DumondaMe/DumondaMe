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

describe('Ask not registered user to answer question', function () {

    let startTime, sandbox, stubSendEMail;

    beforeEach(async function () {
        let stubFileSync;
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        sandbox = sinon.sandbox.create();
        stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});
        stubFileSync = sandbox.stub(tmp, 'fileSync');
        stubFileSync.returns({name: 'test', Body: 'test'});
        sandbox.stub(fs, 'writeFileSync');

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('10', {
            creatorId: '1', question: 'Das ist eine Frage', topics: ['topic1'], language: 'de'
        });
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Send invitation to user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite/notRegisteredUser', {
            questionId: '10',
            emails: ['not.exist@irgendwo.ch']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askNotRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`
        }, 'de', 'not.exist@irgendwo.ch').should.be.true;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:InvitedUser {email: 'not.exist@irgendwo.ch'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(1);
    });

    it('Send invitation to user with existing InvitedUser node', async function () {
        dbDsl.invitationSentBeforeRegistration('2', [{
            email: 'not.exist@irgendwo.ch',
            emailNormalized: 'not.exist@irgendwo.ch',
            invitationSent: 500
        }]);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite/notRegisteredUser', {
            questionId: '10',
            emails: ['not.exist@irgendwo.ch']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askNotRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`
        }, 'de', 'not.exist@irgendwo.ch').should.be.true;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:InvitedUser {email: 'not.exist@irgendwo.ch'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(1);
    });

    it('Send invitation to multiple users', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite/notRegisteredUser', {
            questionId: '10',
            emails: ['not.exist@irgendwo.ch', 'not.exist2@irgendwo.ch']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askNotRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`
        }, 'de', 'not.exist@irgendwo.ch').should.be.true;

        stubSendEMail.calledWith("askNotRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`
        }, 'de', 'not.exist2@irgendwo.ch').should.be.true;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})")
            .with(`asked`)
            .match(`(asked)-[:ASKED]->(user:InvitedUser)`)
            .return(`DISTINCT asked, collect(user) AS users`).end().send();
        resp.length.should.equals(1);
        resp[0].users.length.should.equals(2)
    });

    it('Send invitation to user for a question only once', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite/notRegisteredUser', {
            questionId: '10',
            emails: ['not.exist@irgendwo.ch']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askNotRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`
        }, 'de', 'not.exist@irgendwo.ch').should.be.true;
        stubSendEMail.resetHistory();

        res = await requestHandler.put('/api/user/question/invite/notRegisteredUser', {
            questionId: '10',
            emails: ['not.exist@irgendwo.ch']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`
        }, 'de', 'not.exist@irgendwo.ch').should.be.false;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:InvitedUser {email: 'not.exist@irgendwo.ch'})")
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
        let res = await requestHandler.put('/api/user/question/invite/notRegisteredUser', {
            questionId: '10',
            emails: ['not.exist@irgendwo.ch']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askNotRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/10/das-ist-eine-frage`
        }, 'de', 'not.exist@irgendwo.ch').should.be.true;

        let resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:InvitedUser {email: 'not.exist@irgendwo.ch'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '10'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(1);

        res = await requestHandler.put('/api/user/question/invite/notRegisteredUser', {
            questionId: '11',
            emails: ['not.exist@irgendwo.ch']
        });
        res.status.should.equal(200);

        stubSendEMail.calledWith("askNotRegisteredUserAnswerQuestion", {
            name: `user Meier`, question: 'Das ist eine Frage2', userImage: sinon.match.any,
            questionLink: `${process.env.DUMONDA_ME_DOMAIN}question/11/das-ist-eine-frage2`
        }, 'de', 'not.exist@irgendwo.ch').should.be.true;

        resp = await db.cypher().match("(:User {userId: '1'})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:ASKED]->(:InvitedUser {email: 'not.exist@irgendwo.ch'})")
            .with(`asked`)
            .match(`(asked)-[:QUESTION_TO_ANSWER]->(:Question {questionId: '11'})`)
            .return(`asked`).end().send();
        resp.length.should.equals(1);
    });

    it('Emails are the same in lowercase', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/question/invite/notRegisteredUser', {
            questionId: '10',
            emails: ['not.exist@irgendwo.ch', 'Not.exist@irgendwo.ch']
        });
        res.status.should.equal(400);
    });
});
