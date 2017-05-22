'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for rating answers of a forum question', function () {

    beforeEach(function () {

        return dbDsl.init(2).then(function () {
            dbDsl.createForumQuestion('0', {adminId: '1', language: 'de', topic: ['environmental'], created: 501});

            dbDsl.createBookPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'Hans Muster', publishDate: 1000});

            dbDsl.createForumSolution('0', {adminId: '1', questionId: '0', created: 500, referencePageId: '0'});
            dbDsl.createForumProArgument('1', {adminId: '2', questionId: '0', created: 501, referencePageId: '0'});
            dbDsl.createForumCounterArgument('2', {adminId: '2', questionId: '0', created: 502, referencePageId: '0'});

            dbDsl.createForumSolution('3', {adminId: '1', questionId: '0', created: 500, referencePageId: '0'});
            dbDsl.createForumProArgument('4', {adminId: '2', questionId: '0', created: 501, referencePageId: '0'});
            dbDsl.createForumCounterArgument('5', {adminId: '2', questionId: '0', created: 502, referencePageId: '0'});

            dbDsl.forumRatePositiveAnswer('1', '3');
            dbDsl.forumRatePositiveAnswer('1', '4');
            dbDsl.forumRatePositiveAnswer('1', '5');

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Positive rate a solution', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '0'})" +
                "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(1);
        });
    });

    it('Delete positive rating of a solution', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/forum/question/answer/rate', {
                answerId: '3'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '3'})" +
                "<-[:RATE_POSITIVE]-(:User)")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Positive rate a pro argument', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '1'})" +
                "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(1);
        });
    });

    it('Delete positive rating of a pro argument', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/forum/question/answer/rate', {
                answerId: '4'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '4'})" +
                "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Positive rate a counter argument', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '2'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '2'})" +
                "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(1);
        });
    });

    it('Delete positive rating of a counter argument', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/forum/question/answer/rate', {
                answerId: '5'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '5'})" +
                "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });


    it('Positive rate a answer twice. Second rate is dismissed- Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer {answerId: '0'})" +
                "<-[:RATE_POSITIVE]-(:User {userId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(1);
        });
    });

});
