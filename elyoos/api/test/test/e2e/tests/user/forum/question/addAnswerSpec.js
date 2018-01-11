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

    it('Creating a new pro argument answer for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb', title = "title";
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '0',
                    title: title,
                    description: description,
                    type: 'proArgument'
                }
            });
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumAnswer {answerId: {answerId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.title.should.equals(title);
            answer[0].answer.type.should.equals('proArgument');
        });
    });

    it('Creating a new counter argument answer for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb', title = "title";
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '0',
                    title: title,
                    description: description,
                    type: 'counterArgument'
                }
            });
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumAnswer {answerId: {answerId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.title.should.equals(title);
            answer[0].answer.type.should.equals('counterArgument');
        });
    });

    it('Creating a new solution answer for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb', title = "title";
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '0',
                    title: title,
                    description: description,
                    type: 'solution'
                }
            });
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumAnswer {answerId: {answerId}})" +
                "<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.title.should.equals(title);
            answer[0].answer.type.should.equals('solution');
        });
    });

    it('Creating a new pro argument answer with reference to page for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                page: {
                    questionId: '0',
                    pageId: '0',
                    description: description,
                    type: 'proArgument'
                }
            });
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumAnswer {answerId: {answerId}})" +
                    "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.type.should.equals('proArgument');
        });
    });

    it('Creating a new counter argument answer with reference to page for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                page: {
                    questionId: '0',
                    pageId: '0',
                    description: description,
                    type: 'counterArgument'
                }
            });
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumAnswer {answerId: {answerId}})" +
                "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.type.should.equals('counterArgument');
        });
    });

    it('Creating a new solution answer with reference to page for a forum question - Return 200', function () {

        let answerId,
            description = 'Deshalb';
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                page: {
                    questionId: '0',
                    pageId: '0',
                    description: description,
                    type: 'solution'
                }
            });
        }).then(function (res) {
            answerId = res.body.answerId;
            res.status.should.equal(200);
            return db.cypher().match("(:ForumQuestion {questionId: '0'})-[:IS_ANSWER]->(answer:ForumAnswer {answerId: {answerId}})" +
                "-[:REFERENCE]->(:Page {pageId: '0'})")
                .return('answer')
                .end({answerId: answerId}).send();
        }).then(function (answer) {
            answer.length.should.equals(1);
            answer[0].answer.description.should.equals(description);
            answer[0].answer.type.should.equals('solution');
        });
    });

    it('Creating a new pro argument answer fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '1',
                    title: 'title',
                    description: 'Deshalb',
                    type: 'proArgument'
                }
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer)")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Creating a new counter argument answer fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '1',
                    title: 'title',
                    description: 'Deshalb',
                    type: 'counterArgument'
                }
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer)")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Creating a new solution answer fails because of non existing questionId - Return 400', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer', {
                normal: {
                    questionId: '1',
                    title: 'title',
                    description: 'Deshalb',
                    type: 'solution'
                }
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer)")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

});
