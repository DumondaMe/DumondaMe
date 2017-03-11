'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for adding answers to a forum question', function () {

    beforeEach(function () {

        return dbDsl.init(2).then(function () {
            dbDsl.createBookPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'Hans Muster', publishDate: 1000});
            dbDsl.createForumQuestion('0', {adminId: '2', language: 'de', topic: ['environmental'], created: 501});
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Creating a new explanation answer for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb', title = "title";
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '0',
                    title: title,
                    description: description,
                    type: 'explanation'
                }
            }, agent);
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumExplanation:ForumAnswer {answerId: {answerId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.title.should.equals(title);
        });
    });

    it('Creating a new solution answer for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb', title = "title";
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '0',
                    title: title,
                    description: description,
                    type: 'solution'
                }
            }, agent);
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumSolution:ForumAnswer {answerId: {answerId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.title.should.equals(title);
        });
    });

    it('Creating a new explanation answer with reference to page for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer', {
                page: {
                    questionId: '0',
                    pageId: '0',
                    description: description,
                    type: 'explanation'
                }
            }, agent);
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumExplanation:ForumAnswer {answerId: {answerId}})" +
                    "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
        });
    });

    it('Creating a new solution answer with reference to page for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer', {
                page: {
                    questionId: '0',
                    pageId: '0',
                    description: description,
                    type: 'solution'
                }
            }, agent);
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumSolution:ForumAnswer {answerId: {answerId}})" +
                "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
        });
    });

    it('Creating a new explanation answer fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '1',
                    title: 'title',
                    description: 'Deshalb',
                    type: 'explanation'
                }
            }, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer)")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Creating a new solution answer fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '1',
                    title: 'title',
                    description: 'Deshalb',
                    type: 'solution'
                }
            }, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer)")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

});
