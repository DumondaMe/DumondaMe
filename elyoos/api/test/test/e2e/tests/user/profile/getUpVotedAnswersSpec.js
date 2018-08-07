'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Get answers up voted by the requested user', function () {

    beforeEach(async function () {
        await dbDsl.init(9);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});

        dbDsl.createCommitment('20', {
            adminId: '1', topics: ['topic1', 'topic2'], language: 'de', created: 444, modified: 606,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Commitment'
        });

        dbDsl.createQuestion('100', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world',
            topics: ['topic2'], language: 'de', created: 666
        });
        dbDsl.createBookAnswer('10', {
            creatorId: '3', questionId: '100', created: 1000, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });

        dbDsl.createBookAnswer('1', {
            creatorId: '3', questionId: '100', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createCommitmentAnswer('2', {
            creatorId: '3', questionId: '100', commitmentId: '20', created: 554, description: 'commitmentDescription'
        });
        dbDsl.createLinkAnswer('3', {
            creatorId: '3', questionId: '100', created: 553, link: 'https://example.com', pageType: 'blog', hasPreviewImage: true
        });
        dbDsl.createTextAnswer('4', {
            creatorId: '3', questionId:'100', answer: 'Answer', created: 552
        });
        dbDsl.createYoutubeAnswer('5', {
            creatorId: '3', questionId: '100', created: 551, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });

        dbDsl.createBookAnswer('11', {
            creatorId: '3', questionId: '100', created: 444, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });

        dbDsl.upVoteAnswer({userId: '1', answerId: '10', created: 1100});
        dbDsl.upVoteAnswer({userId: '1', answerId: '1', created: 777});
        dbDsl.upVoteAnswer({userId: '1', answerId: '2', created: 776});
        dbDsl.upVoteAnswer({userId: '1', answerId: '3', created: 775});
        dbDsl.upVoteAnswer({userId: '1', answerId: '4', created: 774});
        dbDsl.upVoteAnswer({userId: '1', answerId: '5', created: 773});
        dbDsl.upVoteAnswer({userId: '1', answerId: '11', created: 333});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get answers the logged in user has up voted', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/answer', {
            userId: '1', maxItems: 5, skip: 1, upVoted: true, language: 'de'
        });
        res.status.should.equal(200);
        res.body.numberOfAnswers.should.equal(7);
        res.body.answers.length.should.equal(5);

        res.body.answers[0].type.should.equals('Book');
        res.body.answers[0].action.should.equals('upVote');
        res.body.answers[0].answerId.should.equals('1');
        res.body.answers[0].title.should.equals('book1Title');
        res.body.answers[0].description.should.equals('book1Description');
        res.body.answers[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/1/120x250/preview.jpg`);
        res.body.answers[0].questionId.should.equals('100');
        res.body.answers[0].question.should.equals('Das ist eine Frage');
        res.body.answers[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[0].created.should.equals(777);

        res.body.answers[1].type.should.equals('CommitmentAnswer');
        res.body.answers[1].action.should.equals('upVote');
        res.body.answers[1].answerId.should.equals('2');
        res.body.answers[1].commitmentId.should.equals('20');
        res.body.answers[1].commitmentSlug.should.equals('das-ist-ein-commitment');
        res.body.answers[1].title.should.equals('Das ist ein Commitment');
        res.body.answers[1].description.should.equals('commitmentDescription');
        res.body.answers[1].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/20/460x460/title.jpg?v=606`);
        res.body.answers[1].questionId.should.equals('100');
        res.body.answers[1].question.should.equals('Das ist eine Frage');
        res.body.answers[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[1].regions.length.should.equals(1);
        res.body.answers[1].regions.should.includes('regionDe');
        res.body.answers[1].created.should.equals(776);

        res.body.answers[2].type.should.equals('Link');
        res.body.answers[2].pageType.should.equals('blog');
        res.body.answers[2].action.should.equals('upVote');
        res.body.answers[2].answerId.should.equals('3');
        res.body.answers[2].title.should.equals('link3Title');
        res.body.answers[2].description.should.equals('link3Description');
        res.body.answers[2].link.should.equals('https://example.com');
        res.body.answers[2].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/3/460x460/preview.jpg`);
        res.body.answers[2].questionId.should.equals('100');
        res.body.answers[2].question.should.equals('Das ist eine Frage');
        res.body.answers[2].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[2].created.should.equals(775);

        res.body.answers[3].type.should.equals('Text');
        res.body.answers[3].action.should.equals('upVote');
        res.body.answers[3].answerId.should.equals('4');
        res.body.answers[3].answer.should.equals('Answer');
        res.body.answers[3].questionId.should.equals('100');
        res.body.answers[3].question.should.equals('Das ist eine Frage');
        res.body.answers[3].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[3].created.should.equals(774);

        res.body.answers[4].type.should.equals('Youtube');
        res.body.answers[4].action.should.equals('upVote');
        res.body.answers[4].answerId.should.equals('5');
        res.body.answers[4].title.should.equals('youtube5Title');
        res.body.answers[4].description.should.equals('youtube5Description');
        res.body.answers[4].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[4].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[4].link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        res.body.answers[4].questionId.should.equals('100');
        res.body.answers[4].question.should.equals('Das ist eine Frage');
        res.body.answers[4].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[4].created.should.equals(773);
    });

    it('Get answers a user has up voted (public, visible)', async function () {

        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/answer', {
            userId: '1', maxItems: 5, skip: 1, upVoted: true, language: 'de'
        });
        res.status.should.equal(200);
        res.body.numberOfAnswers.should.equal(7);
        res.body.answers.length.should.equal(5);

        res.body.answers[0].type.should.equals('Book');
        res.body.answers[0].action.should.equals('upVote');
        res.body.answers[0].answerId.should.equals('1');
        res.body.answers[0].title.should.equals('book1Title');
        res.body.answers[0].description.should.equals('book1Description');
        res.body.answers[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/1/120x250/preview.jpg`);
        res.body.answers[0].questionId.should.equals('100');
        res.body.answers[0].question.should.equals('Das ist eine Frage');
        res.body.answers[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[0].created.should.equals(777);

        res.body.answers[1].type.should.equals('CommitmentAnswer');
        res.body.answers[1].action.should.equals('upVote');
        res.body.answers[1].answerId.should.equals('2');
        res.body.answers[1].commitmentId.should.equals('20');
        res.body.answers[1].commitmentSlug.should.equals('das-ist-ein-commitment');
        res.body.answers[1].title.should.equals('Das ist ein Commitment');
        res.body.answers[1].description.should.equals('commitmentDescription');
        res.body.answers[1].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/20/460x460/title.jpg?v=606`);
        res.body.answers[1].questionId.should.equals('100');
        res.body.answers[1].question.should.equals('Das ist eine Frage');
        res.body.answers[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[1].regions.length.should.equals(1);
        res.body.answers[1].regions.should.includes('regionDe');
        res.body.answers[1].created.should.equals(776);

        res.body.answers[2].type.should.equals('Link');
        res.body.answers[2].pageType.should.equals('blog');
        res.body.answers[2].action.should.equals('upVote');
        res.body.answers[2].answerId.should.equals('3');
        res.body.answers[2].title.should.equals('link3Title');
        res.body.answers[2].description.should.equals('link3Description');
        res.body.answers[2].link.should.equals('https://example.com');
        res.body.answers[2].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/3/460x460/preview.jpg`);
        res.body.answers[2].questionId.should.equals('100');
        res.body.answers[2].question.should.equals('Das ist eine Frage');
        res.body.answers[2].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[2].created.should.equals(775);

        res.body.answers[3].type.should.equals('Text');
        res.body.answers[3].action.should.equals('upVote');
        res.body.answers[3].answerId.should.equals('4');
        res.body.answers[3].answer.should.equals('Answer');
        res.body.answers[3].questionId.should.equals('100');
        res.body.answers[3].question.should.equals('Das ist eine Frage');
        res.body.answers[3].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[3].created.should.equals(774);

        res.body.answers[4].type.should.equals('Youtube');
        res.body.answers[4].action.should.equals('upVote');
        res.body.answers[4].answerId.should.equals('5');
        res.body.answers[4].title.should.equals('youtube5Title');
        res.body.answers[4].description.should.equals('youtube5Description');
        res.body.answers[4].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[4].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[4].link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        res.body.answers[4].questionId.should.equals('100');
        res.body.answers[4].question.should.equals('Das ist eine Frage');
        res.body.answers[4].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[4].created.should.equals(773);
    });

    it('Get answers a user has up voted (publicEl, visible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/answer', {
            userId: '1', maxItems: 2, skip: 1, upVoted: true, language: 'de'
        });
        res.status.should.equal(200);
        res.body.numberOfAnswers.should.equal(7);
        res.body.answers.length.should.equal(2);
    });

    it('Get answers a user has up voted (publicEl, invisible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/user/profile/answer', {
            userId: '1', maxItems: 2, skip: 1, upVoted: true, language: 'de'
        });
        res.status.should.equal(401);
    });

    it('Get answers a user has up voted (onlyContact, visible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/answer', {
            userId: '1', maxItems: 2, skip: 1, upVoted: true, language: 'de'
        });
        res.status.should.equal(200);
        res.body.numberOfAnswers.should.equal(7);
        res.body.answers.length.should.equal(2);
    });

    it('Get answers a user has up voted (onlyContact, invisible)', async function () {

        dbDsl.setUserPrivacy('1', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile/answer', {
            userId: '1', maxItems: 2, skip: 1, upVoted: true, language: 'de'
        });
        res.status.should.equal(401);
    });

});
