'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for deleting answers of a forum question', function () {

    beforeEach(function () {

        return dbDsl.init(2).then(function () {
            dbDsl.createForumQuestion('0', {adminId: '1', language: 'de', topic: ['environmental'], created: 501});

            dbDsl.createBookPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'Hans Muster', publishDate: 1000});

            dbDsl.createForumSolution('0', {adminId: '1', questionId: '0', created: 500, referencePageId: '0'});
            dbDsl.createForumSolution('1', {adminId: '1', questionId: '0', created: 501});
            dbDsl.createForumProArgument('2', {adminId: '1', questionId: '0', created: 502, referencePageId: '0'});
            dbDsl.createForumProArgument('3', {adminId: '1', questionId: '0', created: 503});
            dbDsl.createForumCounterArgument('4', {adminId: '1', questionId: '0', created: 504, referencePageId: '0'});
            dbDsl.createForumCounterArgument('5', {adminId: '1', questionId: '0', created: 505});
            dbDsl.createForumCounterArgument('6', {adminId: '2', questionId: '0', created: 506});

            dbDsl.forumRatePositiveAnswer('1', '0');
            dbDsl.forumRatePositiveAnswer('2', '0');
            dbDsl.forumRatePositiveAnswer('1', '1');
            dbDsl.forumRatePositiveAnswer('2', '1');
            dbDsl.forumRatePositiveAnswer('1', '2');
            dbDsl.forumRatePositiveAnswer('2', '2');
            dbDsl.forumRatePositiveAnswer('1', '3');
            dbDsl.forumRatePositiveAnswer('2', '3');
            dbDsl.forumRatePositiveAnswer('1', '4');
            dbDsl.forumRatePositiveAnswer('2', '4');
            dbDsl.forumRatePositiveAnswer('1', '5');
            dbDsl.forumRatePositiveAnswer('2', '5');

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete a forum solution with page reference', function () {
        
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '0'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '0'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Delete a forum solution', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '1'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '1'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Delete a forum pro argument with page reference', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '2'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '2'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Delete a forum pro argument', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '3'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '3'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Delete a forum counter argument with page reference', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '4'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '4'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Delete a forum counter argument', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '5'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(answer:ForumAnswer {answerId: '5'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(0);
        });
    });

    it('Delete a forum answer of another user is not allowed - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer', {
                answerId: '6'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(answer:ForumAnswer {answerId: '6'})")
                .return('answer').end().send();
        }).then(function (answer) {
            answer.length.should.equals(1);
        });
    });

});
