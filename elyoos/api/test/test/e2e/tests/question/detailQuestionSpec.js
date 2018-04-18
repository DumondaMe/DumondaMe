'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Getting details of a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {});
        dbDsl.createRegion('region-2', {});
        dbDsl.createRegion('region-3', {});

        dbDsl.createCommitment('2', {
            title: 'Das ist ein Engagement', regions: ['region-1', 'region-2'],
            adminId: '2', topics: ['Spiritual', 'Test2'], language: 'de', created: 700, website: 'https://www.example.org/'
        }, []);

        dbDsl.createQuestion('1', {
            creatorId: '1', question: 'Das ist eine Frage', description: 'description',
            topics: ['Spiritual', 'Education'], language: 'de', modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '1', questionId:'1', answer: 'Answer', created: 600,
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '3', questionId:'1', answer: 'Answer2',
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '2', questionId: '1', created: 499, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });
        dbDsl.createLinkAnswer('8', {
            creatorId: '2', questionId: '1', created: 498, hasPreviewImage: true,
            link: 'https://example.com', pageType: 'blog'
        });
        dbDsl.createBookAnswer('9', {
            creatorId: '3', questionId: '1', created: 497, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createCommitmentAnswer('11', {
            creatorId: '2', questionId: '1', commitmentId: '2', created: 496, description: 'test'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting details of a question without answers', async function () {
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2',
            topics: ['Health'], language: 'en', modified: 701
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/2');
        res.status.should.equal(200);
        res.body.question.should.equals('Das ist eine Frage2');
        res.body.description.should.equals('description2');
        res.body.isAdmin.should.equals(false);
        res.body.created.should.equals(500);
        res.body.modified.should.equals(701);
        res.body.language.should.equals('en');
        res.body.creator.name.should.equals('user Meier3');
        res.body.creator.userId.should.equals('3');
        res.body.creator.slug.should.equals('user-meier3');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
        res.body.topics.length.should.equals(1);
        res.body.topics[0].should.equals('Health');

        res.body.answers.length.should.equals(0);
    });

    it('Getting details of a question (answers sorted by date)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1');
        res.status.should.equal(200);
        res.body.question.should.equals('Das ist eine Frage');
        res.body.description.should.equals('description');
        res.body.created.should.equals(500);
        res.body.modified.should.equals(700);
        res.body.language.should.equals('de');
        res.body.isAdmin.should.equals(true);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.userId.should.equals('1');
        res.body.creator.slug.should.equals('user-meier');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');
        res.body.topics.length.should.equals(2);
        res.body.topics.should.include('Spiritual');
        res.body.topics.should.include('Education');

        res.body.answers.length.should.equals(6);
        res.body.answers[0].answerId.should.equals('5');
        res.body.answers[0].answerType.should.equals('Text');
        res.body.answers[0].answer.should.equals('Answer');
        res.body.answers[0].upVotes.should.equals(0);
        res.body.answers[0].isAdmin.should.equals(true);
        res.body.answers[0].hasVoted.should.equals(false);
        res.body.answers[0].created.should.equals(600);
        res.body.answers[0].creator.name.should.equals('user Meier');
        res.body.answers[0].creator.userId.should.equals('1');
        res.body.answers[0].creator.slug.should.equals('user-meier');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        res.body.answers[1].answerId.should.equals('6');
        res.body.answers[1].answerType.should.equals('Text');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(0);
        res.body.answers[1].isAdmin.should.equals(false);
        res.body.answers[1].hasVoted.should.equals(false);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.userId.should.equals('3');
        res.body.answers[1].creator.slug.should.equals('user-meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].answerId.should.equals('7');
        res.body.answers[2].answerType.should.equals('Youtube');
        res.body.answers[2].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[2].link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        res.body.answers[2].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[2].title.should.equals('youtube7Title');
        res.body.answers[2].description.should.equals('youtube7Description');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].isAdmin.should.equals(false);
        res.body.answers[2].hasVoted.should.equals(false);
        res.body.answers[2].created.should.equals(499);
        res.body.answers[2].creator.name.should.equals('user Meier2');
        res.body.answers[2].creator.userId.should.equals('2');
        res.body.answers[2].creator.slug.should.equals('user-meier2');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[3].answerId.should.equals('8');
        res.body.answers[3].answerType.should.equals('Link');
        res.body.answers[3].link.should.equals('https://example.com');
        res.body.answers[3].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/8/120x120/preview.jpg`);
        res.body.answers[3].title.should.equals('link8Title');
        res.body.answers[3].description.should.equals('link8Description');
        res.body.answers[3].pageType.should.equals('blog');
        res.body.answers[3].upVotes.should.equals(0);
        res.body.answers[3].isAdmin.should.equals(false);
        res.body.answers[3].hasVoted.should.equals(false);
        res.body.answers[3].created.should.equals(498);
        res.body.answers[3].creator.name.should.equals('user Meier2');
        res.body.answers[3].creator.userId.should.equals('2');
        res.body.answers[3].creator.slug.should.equals('user-meier2');
        res.body.answers[3].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[4].answerId.should.equals('9');
        res.body.answers[4].answerType.should.equals('Book');
        res.body.answers[4].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/9/120x250/preview.jpg`);
        res.body.answers[4].title.should.equals('book9Title');
        res.body.answers[4].description.should.equals('book9Description');
        res.body.answers[4].authors.should.equals('Hans Wurst');
        res.body.answers[4].upVotes.should.equals(0);
        res.body.answers[4].isAdmin.should.equals(false);
        res.body.answers[4].hasVoted.should.equals(false);
        res.body.answers[4].created.should.equals(497);
        res.body.answers[4].creator.name.should.equals('user Meier3');
        res.body.answers[4].creator.userId.should.equals('3');
        res.body.answers[4].creator.slug.should.equals('user-meier3');
        res.body.answers[4].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[5].answerId.should.equals('11');
        res.body.answers[5].commitmentId.should.equals('2');
        res.body.answers[5].answerType.should.equals('Commitment');
        res.body.answers[5].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/2/120x120/title.jpg`);
        res.body.answers[5].title.should.equals('Das ist ein Engagement');
        res.body.answers[5].commitmentSlug.should.equals('das-ist-ein-engagement');
        res.body.answers[5].description.should.equals('test');
        res.body.answers[5].upVotes.should.equals(0);
        res.body.answers[5].isAdmin.should.equals(false);
        res.body.answers[5].hasVoted.should.equals(false);
        res.body.answers[5].created.should.equals(496);
        res.body.answers[5].regions.length.should.equals(2);
        res.body.answers[5].regions.should.include('region-1');
        res.body.answers[5].regions.should.include('region-2');
        res.body.answers[5].creator.name.should.equals('user Meier2');
        res.body.answers[5].creator.userId.should.equals('2');
        res.body.answers[5].creator.slug.should.equals('user-meier2');
        res.body.answers[5].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
    });

    it('Getting details of a question (answers sorted by up votes)', async function () {

        dbDsl.upVoteAnswer({userId: '1', answerId: '6'});
        dbDsl.upVoteAnswer({userId: '4', answerId: '7'});
        dbDsl.upVoteAnswer({userId: '5', answerId: '7'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/1');
        res.status.should.equal(200);
        res.body.question.should.equals('Das ist eine Frage');
        res.body.description.should.equals('description');
        res.body.created.should.equals(500);
        res.body.modified.should.equals(700);
        res.body.language.should.equals('de');
        res.body.isAdmin.should.equals(true);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.userId.should.equals('1');
        res.body.creator.slug.should.equals('user-meier');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');
        res.body.topics.length.should.equals(2);
        res.body.topics.should.include('Spiritual');
        res.body.topics.should.include('Education');

        res.body.answers.length.should.equals(6);
        res.body.answers[0].answerId.should.equals('7');
        res.body.answers[0].answerType.should.equals('Youtube');
        res.body.answers[0].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[0].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[0].link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        res.body.answers[0].title.should.equals('youtube7Title');
        res.body.answers[0].description.should.equals('youtube7Description');
        res.body.answers[0].upVotes.should.equals(2);
        res.body.answers[0].isAdmin.should.equals(false);
        res.body.answers[0].hasVoted.should.equals(false);
        res.body.answers[0].created.should.equals(499);
        res.body.answers[0].creator.name.should.equals('user Meier2');
        res.body.answers[0].creator.userId.should.equals('2');
        res.body.answers[0].creator.slug.should.equals('user-meier2');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[1].answerId.should.equals('6');
        res.body.answers[1].answerType.should.equals('Text');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(1);
        res.body.answers[1].isAdmin.should.equals(false);
        res.body.answers[1].hasVoted.should.equals(true);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.userId.should.equals('3');
        res.body.answers[1].creator.slug.should.equals('user-meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].answerId.should.equals('5');
        res.body.answers[2].answerType.should.equals('Text');
        res.body.answers[2].answer.should.equals('Answer');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].isAdmin.should.equals(true);
        res.body.answers[2].hasVoted.should.equals(false);
        res.body.answers[2].created.should.equals(600);
        res.body.answers[2].creator.name.should.equals('user Meier');
        res.body.answers[2].creator.userId.should.equals('1');
        res.body.answers[2].creator.slug.should.equals('user-meier');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        res.body.answers[3].answerId.should.equals('8');
        res.body.answers[3].answerType.should.equals('Link');
        res.body.answers[3].link.should.equals('https://example.com');
        res.body.answers[3].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/8/120x120/preview.jpg`);
        res.body.answers[3].title.should.equals('link8Title');
        res.body.answers[3].description.should.equals('link8Description');
        res.body.answers[3].pageType.should.equals('blog');
        res.body.answers[3].upVotes.should.equals(0);
        res.body.answers[3].isAdmin.should.equals(false);
        res.body.answers[3].hasVoted.should.equals(false);
        res.body.answers[3].created.should.equals(498);
        res.body.answers[3].creator.name.should.equals('user Meier2');
        res.body.answers[3].creator.userId.should.equals('2');
        res.body.answers[3].creator.slug.should.equals('user-meier2');
        res.body.answers[3].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[4].answerId.should.equals('9');
        res.body.answers[4].answerType.should.equals('Book');
        res.body.answers[4].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/9/120x250/preview.jpg`);
        res.body.answers[4].title.should.equals('book9Title');
        res.body.answers[4].description.should.equals('book9Description');
        res.body.answers[4].authors.should.equals('Hans Wurst');
        res.body.answers[4].upVotes.should.equals(0);
        res.body.answers[4].isAdmin.should.equals(false);
        res.body.answers[4].hasVoted.should.equals(false);
        res.body.answers[4].created.should.equals(497);
        res.body.answers[4].creator.name.should.equals('user Meier3');
        res.body.answers[4].creator.userId.should.equals('3');
        res.body.answers[4].creator.slug.should.equals('user-meier3');
        res.body.answers[4].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[5].answerId.should.equals('11');
        res.body.answers[5].commitmentId.should.equals('2');
        res.body.answers[5].answerType.should.equals('Commitment');
        res.body.answers[5].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/2/120x120/title.jpg`);
        res.body.answers[5].title.should.equals('Das ist ein Engagement');
        res.body.answers[5].commitmentSlug.should.equals('das-ist-ein-engagement');
        res.body.answers[5].description.should.equals('test');
        res.body.answers[5].upVotes.should.equals(0);
        res.body.answers[5].isAdmin.should.equals(false);
        res.body.answers[5].hasVoted.should.equals(false);
        res.body.answers[5].created.should.equals(496);
        res.body.answers[5].regions.length.should.equals(2);
        res.body.answers[5].regions.should.include('region-1');
        res.body.answers[5].regions.should.include('region-2');
        res.body.answers[5].creator.name.should.equals('user Meier2');
        res.body.answers[5].creator.userId.should.equals('2');
        res.body.answers[5].creator.slug.should.equals('user-meier2');
        res.body.answers[5].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
    });

    it('Getting details of a question when not logged in (answers sorted by date)', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/question/detail/1');
        res.status.should.equal(200);
        res.body.question.should.equals('Das ist eine Frage');
        res.body.description.should.equals('description');
        res.body.created.should.equals(500);
        res.body.modified.should.equals(700);
        res.body.language.should.equals('de');
        res.body.isAdmin.should.equals(false);
        res.body.creator.name.should.equals('user Meier');
        res.body.creator.userId.should.equals('1');
        res.body.creator.slug.should.equals('user-meier');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');
        res.body.topics.length.should.equals(2);
        res.body.topics.should.include('Spiritual');
        res.body.topics.should.include('Education');

        res.body.answers.length.should.equals(6);
        res.body.answers[0].answerId.should.equals('5');
        res.body.answers[0].answerType.should.equals('Text');
        res.body.answers[0].answer.should.equals('Answer');
        res.body.answers[0].upVotes.should.equals(0);
        res.body.answers[0].isAdmin.should.equals(false);
        res.body.answers[0].hasVoted.should.equals(false);
        res.body.answers[0].created.should.equals(600);
        res.body.answers[0].creator.name.should.equals('user Meier');
        res.body.answers[0].creator.userId.should.equals('1');
        res.body.answers[0].creator.slug.should.equals('user-meier');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        res.body.answers[1].answerId.should.equals('6');
        res.body.answers[1].answerType.should.equals('Text');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(0);
        res.body.answers[1].isAdmin.should.equals(false);
        res.body.answers[1].hasVoted.should.equals(false);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.userId.should.equals('3');
        res.body.answers[1].creator.slug.should.equals('user-meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].answerId.should.equals('7');
        res.body.answers[2].answerType.should.equals('Youtube');
        res.body.answers[2].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[2].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[2].link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        res.body.answers[2].title.should.equals('youtube7Title');
        res.body.answers[2].description.should.equals('youtube7Description');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].isAdmin.should.equals(false);
        res.body.answers[2].hasVoted.should.equals(false);
        res.body.answers[2].created.should.equals(499);
        res.body.answers[2].creator.name.should.equals('user Meier2');
        res.body.answers[2].creator.userId.should.equals('2');
        res.body.answers[2].creator.slug.should.equals('user-meier2');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[3].answerId.should.equals('8');
        res.body.answers[3].answerType.should.equals('Link');
        res.body.answers[3].link.should.equals('https://example.com');
        res.body.answers[3].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/8/120x120/preview.jpg`);
        res.body.answers[3].title.should.equals('link8Title');
        res.body.answers[3].description.should.equals('link8Description');
        res.body.answers[3].pageType.should.equals('blog');
        res.body.answers[3].upVotes.should.equals(0);
        res.body.answers[3].isAdmin.should.equals(false);
        res.body.answers[3].hasVoted.should.equals(false);
        res.body.answers[3].created.should.equals(498);
        res.body.answers[3].creator.name.should.equals('user Meier2');
        res.body.answers[3].creator.userId.should.equals('2');
        res.body.answers[3].creator.slug.should.equals('user-meier2');
        res.body.answers[3].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[4].answerId.should.equals('9');
        res.body.answers[4].answerType.should.equals('Book');
        res.body.answers[4].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/9/120x250/preview.jpg`);
        res.body.answers[4].title.should.equals('book9Title');
        res.body.answers[4].description.should.equals('book9Description');
        res.body.answers[4].authors.should.equals('Hans Wurst');
        res.body.answers[4].upVotes.should.equals(0);
        res.body.answers[4].isAdmin.should.equals(false);
        res.body.answers[4].hasVoted.should.equals(false);
        res.body.answers[4].created.should.equals(497);
        res.body.answers[4].creator.name.should.equals('user Meier3');
        res.body.answers[4].creator.userId.should.equals('3');
        res.body.answers[4].creator.slug.should.equals('user-meier3');
        res.body.answers[4].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[5].answerId.should.equals('11');
        res.body.answers[5].commitmentId.should.equals('2');
        res.body.answers[5].answerType.should.equals('Commitment');
        res.body.answers[5].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/2/120x120/title.jpg`);
        res.body.answers[5].title.should.equals('Das ist ein Engagement');
        res.body.answers[5].commitmentSlug.should.equals('das-ist-ein-engagement');
        res.body.answers[5].description.should.equals('test');
        res.body.answers[5].upVotes.should.equals(0);
        res.body.answers[5].isAdmin.should.equals(false);
        res.body.answers[5].hasVoted.should.equals(false);
        res.body.answers[5].created.should.equals(496);
        res.body.answers[5].regions.length.should.equals(2);
        res.body.answers[5].regions.should.include('region-1');
        res.body.answers[5].regions.should.include('region-2');
        res.body.answers[5].creator.name.should.equals('user Meier2');
        res.body.answers[5].creator.userId.should.equals('2');
        res.body.answers[5].creator.slug.should.equals('user-meier2');
        res.body.answers[5].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
    });
});
