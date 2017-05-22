'use strict';

let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Integration Tests for getting the most popular questions in the forum', function () {

    beforeEach(function () {

        return dbDsl.init(6).then(function () {
            dbDsl.createForumQuestion('0', {adminId: '1', language: 'de', topic: ['spiritual'], created: 500});
            dbDsl.createForumQuestion('1', {adminId: '2', language: 'en', topic: ['environment'], created: 501});
            dbDsl.createForumQuestion('2', {adminId: '3', language: 'de', topic: ['health'], created: 502});

            dbDsl.createForumSolution('0', {adminId: '1', questionId: '0', created: 500});
            dbDsl.createForumSolution('1', {adminId: '1', questionId: '1', created: 500});
            dbDsl.createForumProArgument('2', {adminId: '3', questionId: '2', created: 503});
            dbDsl.createForumProArgument('3', {adminId: '3', questionId: '1', created: 503});
            dbDsl.createForumCounterArgument('4', {adminId: '4', questionId: '2', created: 505});
            dbDsl.createForumCounterArgument('5', {adminId: '2', questionId: '0', created: 505});

            dbDsl.forumRatePositiveAnswer('1', '0');
            dbDsl.forumRatePositiveAnswer('2', '0');
            dbDsl.forumRatePositiveAnswer('3', '0');
            dbDsl.forumRatePositiveAnswer('4', '0');
            dbDsl.forumRatePositiveAnswer('4', '5');
            dbDsl.forumRatePositiveAnswer('3', '5');

            dbDsl.forumRatePositiveAnswer('1', '1');
            dbDsl.forumRatePositiveAnswer('2', '3');
            dbDsl.forumRatePositiveAnswer('3', '3');

            dbDsl.forumRatePositiveAnswer('1', '2');
            dbDsl.forumRatePositiveAnswer('2', '4');

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the most popular questions over all - Return 200', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/forum/question/popular', {
                maxItems: 10,
                skip: 0
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.question.length.should.equals(3);

            res.body.question[0].questionId.should.equals('0');
            res.body.question[0].activityRating.should.equals(6);
            res.body.question[0].description.should.equals('question0Description');
            res.body.question[0].topic.length.should.equals(1);
            res.body.question[0].topic[0].should.equals('spiritual');
            res.body.question[0].isAdmin.should.equals(true);

            res.body.question[1].questionId.should.equals('1');
            res.body.question[1].activityRating.should.equals(3);
            res.body.question[1].description.should.equals('question1Description');
            res.body.question[1].topic.length.should.equals(1);
            res.body.question[1].topic[0].should.equals('environment');
            res.body.question[1].isAdmin.should.equals(false);

            res.body.question[2].questionId.should.equals('2');
            res.body.question[2].activityRating.should.equals(2);
            res.body.question[2].description.should.equals('question2Description');
            res.body.question[2].topic.length.should.equals(1);
            res.body.question[2].topic[0].should.equals('health');
            res.body.question[2].isAdmin.should.equals(false);
        });
    });

});
