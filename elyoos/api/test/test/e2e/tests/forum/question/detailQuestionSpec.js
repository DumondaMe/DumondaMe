'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Integration Tests for getting the details of a forum question', function () {

    beforeEach(function () {

        return dbDsl.init(6).then(function () {
            dbDsl.createBookPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'Hans Muster', publishDate: 1000});
            dbDsl.createYoutubePage('1', {
                language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
            dbDsl.createLinkPage('2', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'www.host.com/test', heightPreviewImage: 200});

            dbDsl.createForumQuestion('0', {adminId: '1', language: 'de', topic: ['environmental'], created: 501});

            dbDsl.createForumSolution('0', {adminId: '1', questionId: '0', created: 500, referencePageId: '1'});
            dbDsl.createForumSolution('1', {adminId: '2', questionId: '0', created: 501});
            dbDsl.createForumProArgument('2', {adminId: '3', questionId: '0', created: 502, referencePageId: '0'});
            dbDsl.createForumProArgument('3', {adminId: '3', questionId: '0', created: 503});
            dbDsl.createForumCounterArgument('4', {adminId: '2', questionId: '0', created: 504, referencePageId: '2'});
            dbDsl.createForumCounterArgument('5', {adminId: '1', questionId: '0', created: 505});

            dbDsl.forumRatePositiveAnswer('1', '0');
            dbDsl.forumRatePositiveAnswer('2', '0');
            dbDsl.forumRatePositiveAnswer('3', '0');
            dbDsl.forumRatePositiveAnswer('2', '1');
            dbDsl.forumRatePositiveAnswer('3', '1');
            dbDsl.forumRatePositiveAnswer('4', '2');
            dbDsl.forumRatePositiveAnswer('5', '2');
            dbDsl.forumRatePositiveAnswer('5', '3');
            dbDsl.forumRatePositiveAnswer('4', '4');

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the detail of a forum question', function () {

        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/forum/question/detail', {
                questionId: '0'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            
            res.body.question.description.should.equals('question0Description');
            res.body.question.isAdmin.should.equals(true);
            res.body.question.questionId.should.equals('0');
            res.body.question.language.should.equals('de');
            res.body.question.topic.length.should.equals(1);
            res.body.question.topic[0].should.equals('environmental');

            res.body.solution.length.should.equals(2);
            res.body.solution[0].answerId.should.equals('0');
            res.body.solution[0].created.should.equals(500);
            res.body.solution[0].positiveRating.should.equals(3);
            res.body.solution[0].ratedByUser.should.equals(true);
            res.body.solution[0].isAdmin.should.equals(true);
            res.body.solution[0].page.pageId.should.equals('1');
            res.body.solution[0].page.title.should.equals('page1Title');
            res.body.solution[0].page.label.should.equals('Youtube');
            res.body.solution[0].page.link.should.equals('https://www.youtube.com/watch?v=hTarMdJub0M');
            res.body.solution[0].page.description.should.equals('page1Description');

            res.body.solution[1].answerId.should.equals('1');
            res.body.solution[1].title.should.equals('solution1Title');
            res.body.solution[1].created.should.equals(501);
            res.body.solution[1].positiveRating.should.equals(2);
            res.body.solution[1].ratedByUser.should.equals(false);
            res.body.solution[1].isAdmin.should.equals(false);
            should.not.exist(res.body.solution[1].page);

            res.body.proArgument.length.should.equals(2);
            res.body.proArgument[0].answerId.should.equals('2');
            res.body.proArgument[0].created.should.equals(502);
            res.body.proArgument[0].positiveRating.should.equals(2);
            res.body.proArgument[0].ratedByUser.should.equals(false);
            res.body.proArgument[0].isAdmin.should.equals(false);
            res.body.proArgument[0].page.pageId.should.equals('0');
            res.body.proArgument[0].page.title.should.equals('page0Title');
            res.body.proArgument[0].page.label.should.equals('Book');
            res.body.proArgument[0].page.description.should.equals('page0Description');

            res.body.proArgument[1].answerId.should.equals('3');
            res.body.proArgument[1].title.should.equals('proArgument3Title');
            res.body.proArgument[1].created.should.equals(503);
            res.body.proArgument[1].positiveRating.should.equals(1);
            res.body.proArgument[1].ratedByUser.should.equals(false);
            res.body.proArgument[1].isAdmin.should.equals(false);

            res.body.counterArgument.length.should.equals(2);
            res.body.counterArgument[0].answerId.should.equals('4');
            res.body.counterArgument[0].created.should.equals(504);
            res.body.counterArgument[0].positiveRating.should.equals(1);
            res.body.counterArgument[0].ratedByUser.should.equals(false);
            res.body.counterArgument[0].isAdmin.should.equals(false);
            res.body.counterArgument[0].page.pageId.should.equals('2');
            res.body.counterArgument[0].page.title.should.equals('page2Title');
            res.body.counterArgument[0].page.label.should.equals('Link');
            res.body.counterArgument[0].page.description.should.equals('page2Description');

            res.body.counterArgument[1].answerId.should.equals('5');
            res.body.counterArgument[1].title.should.equals('counterArgument5Title');
            res.body.counterArgument[1].created.should.equals(505);
            res.body.counterArgument[1].positiveRating.should.equals(0);
            res.body.counterArgument[1].ratedByUser.should.equals(false);
            res.body.counterArgument[1].isAdmin.should.equals(true);
        });
    });

});
