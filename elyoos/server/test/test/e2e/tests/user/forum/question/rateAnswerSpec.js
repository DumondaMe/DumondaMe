'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for rating answers of a forum question', function () {

    let requestAgent;

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
        /*return db.clearDatabase().then(function () {
         let commands = [];
         commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})")
         .end().getCommand());

         commands.push(db.cypher().match("(u:User {userId: '1'})")
         .create("(u)-[:IS_ADMIN]->(:ForumQuestion {questionId: '0', description: 'forumQuestion', topic: {topic}, language: 'de'})")
         .end({topic: ['environmental']}).getCommand());

         return db.cypher().match("(u:User {userId: '1'}), (forumQuestion:ForumQuestion {questionId: '0'})")
         .create("(u)-[:IS_ADMIN]->(:ForumAnswer:ForumExplanation {answerId: '0', description: 'forumAnswer'})<-[:IS_ANSWER]-(forumQuestion)")
         .end().send(commands);

         });*/
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Positive rate a solution', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            }, agent);
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

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer/rate', {
                answerId: '3'
            }, agent);
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

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '1'
            }, agent);
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

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer/rate', {
                answerId: '4'
            }, agent);
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

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '2'
            }, agent);
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

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.del('/api/user/forum/question/answer/rate', {
                answerId: '5'
            }, agent);
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

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return requestHandler.post('/api/user/forum/question/answer/rate', {
                answerId: '0'
            }, requestAgent);
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
