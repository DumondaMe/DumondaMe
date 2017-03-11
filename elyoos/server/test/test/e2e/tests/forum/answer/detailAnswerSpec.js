'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Integration Tests for getting the details of a forum answer', function () {

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
            dbDsl.createForumProArgument('2', {adminId: '3', questionId: '0', created: 502});
            dbDsl.createForumProArgument('3', {adminId: '3', questionId: '0', created: 503, referencePageId: '0'});
            dbDsl.createForumCounterArgument('4', {adminId: '2', questionId: '0', created: 504});
            dbDsl.createForumCounterArgument('5', {adminId: '1', questionId: '0', created: 505, referencePageId: '2'});

            dbDsl.forumRatePositiveAnswer('1', '0');
            dbDsl.forumRatePositiveAnswer('2', '0');
            dbDsl.forumRatePositiveAnswer('3', '0');
            dbDsl.forumRatePositiveAnswer('2', '1');
            dbDsl.forumRatePositiveAnswer('3', '1');
            dbDsl.forumRatePositiveAnswer('4', '2');
            dbDsl.forumRatePositiveAnswer('5', '2');
            dbDsl.forumRatePositiveAnswer('5', '3');
            dbDsl.forumRatePositiveAnswer('4', '5');

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the detail of a forum solution answer without referencing a page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '1'
            }, agent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.description.should.equals('question0Description');
            res.body.answer.question.questionId.should.equals('0');
            res.body.answer.question.topic.length.should.equals(1);
            res.body.answer.question.topic[0].should.equals('environmental');
            res.body.answer.answerId.should.equals('1');
            res.body.answer.type.should.equals('solution');
            res.body.answer.title.should.equals('solution1Title');
            res.body.answer.description.should.equals('solution1Description');
            res.body.answer.created.should.equals(501);
            res.body.answer.positiveRating.should.equals(2);
            res.body.answer.ratedByUser.should.equals(false);
            res.body.answer.isAdmin.should.equals(false);
            should.not.exist(res.body.answer.page);
        });
    });

    it('Getting the detail of a forum pro argument answer without referencing a page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '2'
            }, agent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.description.should.equals('question0Description');
            res.body.answer.question.questionId.should.equals('0');
            res.body.answer.question.topic.length.should.equals(1);
            res.body.answer.question.topic[0].should.equals('environmental');
            res.body.answer.answerId.should.equals('2');
            res.body.answer.type.should.equals('proArgument');
            res.body.answer.title.should.equals('proArgument2Title');
            res.body.answer.description.should.equals('proArgument2Description');
            res.body.answer.created.should.equals(502);
            res.body.answer.positiveRating.should.equals(2);
            res.body.answer.ratedByUser.should.equals(false);
            res.body.answer.isAdmin.should.equals(false);
            should.not.exist(res.body.answer.page);
        });
    });

    it('Getting the detail of a forum solution answer with referencing a youtube page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '0'
            }, agent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.description.should.equals('question0Description');
            res.body.answer.question.questionId.should.equals('0');
            res.body.answer.question.topic.length.should.equals(1);
            res.body.answer.question.topic[0].should.equals('environmental');
            res.body.answer.answerId.should.equals('0');
            res.body.answer.type.should.equals('solution');
            res.body.answer.description.should.equals('solution0Description');
            res.body.answer.created.should.equals(500);
            res.body.answer.positiveRating.should.equals(3);
            res.body.answer.ratedByUser.should.equals(true);
            res.body.answer.isAdmin.should.equals(true);

            res.body.answer.page.pageId.should.equals('1');
            res.body.answer.page.title.should.equals('page1Title');
            res.body.answer.page.label.should.equals('Youtube');
            res.body.answer.page.link.should.equals('https://www.youtube.com/watch?v=hTarMdJub0M');
        });
    });

    it('Getting the detail of a forum explanation answer with referencing a book page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '3'
            }, agent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.description.should.equals('question0Description');
            res.body.answer.question.questionId.should.equals('0');
            res.body.answer.question.topic.length.should.equals(1);
            res.body.answer.question.topic[0].should.equals('environmental');
            res.body.answer.answerId.should.equals('3');
            res.body.answer.type.should.equals('proArgument');
            res.body.answer.description.should.equals('proArgument3Description');
            res.body.answer.created.should.equals(503);
            res.body.answer.positiveRating.should.equals(1);
            res.body.answer.ratedByUser.should.equals(false);
            res.body.answer.isAdmin.should.equals(false);

            res.body.answer.page.pageId.should.equals('0');
            res.body.answer.page.title.should.equals('page0Title');
            res.body.answer.page.label.should.equals('Book');
            res.body.answer.page.titleUrl.should.equals('pages/0/pageTitlePicture.jpg');
        });
    });

    it('Getting the detail of a forum explanation answer with referencing a link page - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/forum/answer/detail', {
                answerId: '5'
            }, agent);
        }).then(function (res) {
            res.status.should.equals(200);

            res.body.answer.question.description.should.equals('question0Description');
            res.body.answer.question.questionId.should.equals('0');
            res.body.answer.question.topic.length.should.equals(1);
            res.body.answer.question.topic[0].should.equals('environmental');
            res.body.answer.answerId.should.equals('5');
            res.body.answer.type.should.equals('counterArgument');
            res.body.answer.description.should.equals('counterArgument5Description');
            res.body.answer.created.should.equals(505);
            res.body.answer.positiveRating.should.equals(1);
            res.body.answer.ratedByUser.should.equals(false);
            res.body.answer.isAdmin.should.equals(true);

            res.body.answer.page.pageId.should.equals('2');
            res.body.answer.page.title.should.equals('page2Title');
            res.body.answer.page.label.should.equals('Link');
            res.body.answer.page.imageUrl.should.equals('pages/2/normal.jpg');
            res.body.answer.page.link.should.equals('www.host.com/test');
            res.body.answer.page.hostname.should.equals('www.host.com');
        });
    });

});
