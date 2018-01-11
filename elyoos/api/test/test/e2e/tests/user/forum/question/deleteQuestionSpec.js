'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for deleting a forum question', function () {

    beforeEach(function () {

        return dbDsl.init(2).then(function () {
            dbDsl.createForumQuestion('0', {adminId: '1', language: 'de', topic: ['environmental'], created: 501});
            dbDsl.createForumQuestion('1', {adminId: '2', language: 'de', topic: ['environmental'], created: 501});

            dbDsl.createBookPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'Hans Muster', publishDate: 1000});

            dbDsl.createForumSolution('0', {adminId: '1', questionId: '0', created: 500, referencePageId: '0'});
            dbDsl.createForumProArgument('1', {adminId: '2', questionId: '0', created: 501, referencePageId: '0'});
            dbDsl.createForumCounterArgument('2', {adminId: '2', questionId: '0', created: 502, referencePageId: '0'});

            dbDsl.forumRatePositiveAnswer('2', '0');
            dbDsl.forumRatePositiveAnswer('2', '1');
            dbDsl.forumRatePositiveAnswer('2', '2');

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete a forum question', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/forum/question', {
                questionId: '0'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(question:ForumQuestion {questionId: '0'})").return('question').end().send();
        }).then(function (question) {
            question.length.should.equals(0);
            return db.cypher().match("(answer:ForumAnswer)").return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Delete a forum question of another user is not allowed - Return 400', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/forum/question', {
                questionId: '1'
            });
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(question:ForumQuestion {questionId: '1'})").return('question').end().send();
        }).then(function (question) {
            question.length.should.equals(1);
        });
    });
});
