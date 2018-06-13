'use strict';

let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Getting user profile with answers', function () {

    beforeEach(async function () {
        await dbDsl.init(4);

        dbDsl.createRegion('region-1', {});

        dbDsl.createCommitment('20', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 444, modified: 606,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Commitment'
        });

        dbDsl.createQuestion('100', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world', topics: ['Spiritual'],
            language: 'de', created: 666
        });

        dbDsl.createBookAnswer('1', {
            creatorId: '1', questionId: '100', created: 555, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createCommitmentAnswer('2', {
            creatorId: '1', questionId: '100', commitmentId: '20', created: 554, description: 'commitmentDescription'
        });
        dbDsl.createLinkAnswer('3', {
            creatorId: '1', questionId: '100', created: 553, link: 'https://example.com', pageType: 'blog', hasPreviewImage: true
        });
        dbDsl.createTextAnswer('4', {
            creatorId: '1', questionId:'100', answer: 'Answer', created: 552
        });
        dbDsl.createYoutubeAnswer('5', {
            creatorId: '1', questionId: '100', created: 551, idOnYoutube: 'Lhku7ZBWEK8',
            link: 'https://www.youtube.com/watch?v=Lhku7ZBWEK8', linkEmbed: 'https://www.youtube.com/embed/Lhku7ZBWEK8'
        });

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get profile of logged in user', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile');
        res.status.should.equal(200);

        res.body.numberOfAnswers.should.equal(5);
        res.body.numberOfUpVotedAnswers.should.equal(0);

        res.body.answers.length.should.equal(5);

        res.body.answers[0].type.should.equals('Book');
        res.body.answers[0].action.should.equals('created');
        res.body.answers[0].answerId.should.equals('1');
        res.body.answers[0].title.should.equals('book1Title');
        res.body.answers[0].description.should.equals('book1Description');
        res.body.answers[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/1/120x250/preview.jpg`);
        res.body.answers[0].questionId.should.equals('100');
        res.body.answers[0].question.should.equals('Das ist eine Frage');
        res.body.answers[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[0].created.should.equals(555);

        res.body.answers[1].type.should.equals('CommitmentAnswer');
        res.body.answers[1].action.should.equals('created');
        res.body.answers[1].answerId.should.equals('2');
        res.body.answers[1].commitmentId.should.equals('20');
        res.body.answers[1].commitmentSlug.should.equals('das-ist-ein-commitment');
        res.body.answers[1].title.should.equals('Das ist ein Commitment');
        res.body.answers[1].description.should.equals('commitmentDescription');
        res.body.answers[1].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/20/120x120/title.jpg?v=606`);
        res.body.answers[1].questionId.should.equals('100');
        res.body.answers[1].question.should.equals('Das ist eine Frage');
        res.body.answers[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[1].regions.length.should.equals(1);
        res.body.answers[1].regions.should.includes('region-1');
        res.body.answers[1].created.should.equals(554);

        res.body.answers[2].type.should.equals('Link');
        res.body.answers[2].pageType.should.equals('blog');
        res.body.answers[2].action.should.equals('created');
        res.body.answers[2].answerId.should.equals('3');
        res.body.answers[2].title.should.equals('link3Title');
        res.body.answers[2].description.should.equals('link3Description');
        res.body.answers[2].link.should.equals('https://example.com');
        res.body.answers[2].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/3/120x120/preview.jpg`);
        res.body.answers[2].questionId.should.equals('100');
        res.body.answers[2].question.should.equals('Das ist eine Frage');
        res.body.answers[2].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[2].created.should.equals(553);

        res.body.answers[3].type.should.equals('Text');
        res.body.answers[3].action.should.equals('created');
        res.body.answers[3].answerId.should.equals('4');
        res.body.answers[3].answer.should.equals('Answer');
        res.body.answers[3].questionId.should.equals('100');
        res.body.answers[3].question.should.equals('Das ist eine Frage');
        res.body.answers[3].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[3].created.should.equals(552);

        res.body.answers[4].type.should.equals('Youtube');
        res.body.answers[4].action.should.equals('created');
        res.body.answers[4].answerId.should.equals('5');
        res.body.answers[4].title.should.equals('youtube5Title');
        res.body.answers[4].description.should.equals('youtube5Description');
        res.body.answers[4].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[4].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[4].link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        res.body.answers[4].questionId.should.equals('100');
        res.body.answers[4].question.should.equals('Das ist eine Frage');
        res.body.answers[4].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[4].created.should.equals(551);
    });

    it('Get profile of another user', async function () {

        dbDsl.upVoteAnswer({userId: '2', answerId: '1', created: 666});
        dbDsl.upVoteAnswer({userId: '2', answerId: '2', created: 665});
        dbDsl.upVoteAnswer({userId: '2', answerId: '3', created: 664});
        dbDsl.upVoteAnswer({userId: '2', answerId: '4', created: 663});
        dbDsl.upVoteAnswer({userId: '2', answerId: '5', created: 662});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/user/profile', {userId: '2'});
        res.status.should.equal(200);

        res.body.numberOfAnswers.should.equal(0);
        res.body.numberOfUpVotedAnswers.should.equal(5);

        res.body.upVotedAnswers.length.should.equal(5);

        res.body.upVotedAnswers[0].type.should.equals('Book');
        res.body.upVotedAnswers[0].action.should.equals('upVote');
        res.body.upVotedAnswers[0].answerId.should.equals('1');
        res.body.upVotedAnswers[0].title.should.equals('book1Title');
        res.body.upVotedAnswers[0].description.should.equals('book1Description');
        res.body.upVotedAnswers[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/1/120x250/preview.jpg`);
        res.body.upVotedAnswers[0].questionId.should.equals('100');
        res.body.upVotedAnswers[0].question.should.equals('Das ist eine Frage');
        res.body.upVotedAnswers[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.upVotedAnswers[0].created.should.equals(666);

        res.body.upVotedAnswers[1].type.should.equals('CommitmentAnswer');
        res.body.upVotedAnswers[1].action.should.equals('upVote');
        res.body.upVotedAnswers[1].answerId.should.equals('2');
        res.body.upVotedAnswers[1].commitmentId.should.equals('20');
        res.body.upVotedAnswers[1].commitmentSlug.should.equals('das-ist-ein-commitment');
        res.body.upVotedAnswers[1].title.should.equals('Das ist ein Commitment');
        res.body.upVotedAnswers[1].description.should.equals('commitmentDescription');
        res.body.upVotedAnswers[1].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/20/120x120/title.jpg?v=606`);
        res.body.upVotedAnswers[1].questionId.should.equals('100');
        res.body.upVotedAnswers[1].question.should.equals('Das ist eine Frage');
        res.body.upVotedAnswers[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.upVotedAnswers[1].regions.length.should.equals(1);
        res.body.upVotedAnswers[1].regions.should.includes('region-1');
        res.body.upVotedAnswers[1].created.should.equals(665);

        res.body.upVotedAnswers[2].type.should.equals('Link');
        res.body.upVotedAnswers[2].pageType.should.equals('blog');
        res.body.upVotedAnswers[2].action.should.equals('upVote');
        res.body.upVotedAnswers[2].answerId.should.equals('3');
        res.body.upVotedAnswers[2].title.should.equals('link3Title');
        res.body.upVotedAnswers[2].description.should.equals('link3Description');
        res.body.upVotedAnswers[2].link.should.equals('https://example.com');
        res.body.upVotedAnswers[2].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/3/120x120/preview.jpg`);
        res.body.upVotedAnswers[2].questionId.should.equals('100');
        res.body.upVotedAnswers[2].question.should.equals('Das ist eine Frage');
        res.body.upVotedAnswers[2].questionSlug.should.equals('das-ist-eine-frage');
        res.body.upVotedAnswers[2].created.should.equals(664);

        res.body.upVotedAnswers[3].type.should.equals('Text');
        res.body.upVotedAnswers[3].action.should.equals('upVote');
        res.body.upVotedAnswers[3].answerId.should.equals('4');
        res.body.upVotedAnswers[3].answer.should.equals('Answer');
        res.body.upVotedAnswers[3].questionId.should.equals('100');
        res.body.upVotedAnswers[3].question.should.equals('Das ist eine Frage');
        res.body.upVotedAnswers[3].questionSlug.should.equals('das-ist-eine-frage');
        res.body.upVotedAnswers[3].created.should.equals(663);

        res.body.upVotedAnswers[4].type.should.equals('Youtube');
        res.body.upVotedAnswers[4].action.should.equals('upVote');
        res.body.upVotedAnswers[4].answerId.should.equals('5');
        res.body.upVotedAnswers[4].title.should.equals('youtube5Title');
        res.body.upVotedAnswers[4].description.should.equals('youtube5Description');
        res.body.upVotedAnswers[4].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.upVotedAnswers[4].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.upVotedAnswers[4].link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        res.body.upVotedAnswers[4].questionId.should.equals('100');
        res.body.upVotedAnswers[4].question.should.equals('Das ist eine Frage');
        res.body.upVotedAnswers[4].questionSlug.should.equals('das-ist-eine-frage');
        res.body.upVotedAnswers[4].created.should.equals(662);
    });

    it('Get profile data of a user (Not logged in)', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/profile', {userId: '1'});
        res.status.should.equal(200);

        res.body.numberOfAnswers.should.equal(5);
        res.body.numberOfUpVotedAnswers.should.equal(0);

        res.body.answers.length.should.equal(5);

        res.body.answers[0].type.should.equals('Book');
        res.body.answers[0].action.should.equals('created');
        res.body.answers[0].answerId.should.equals('1');
        res.body.answers[0].title.should.equals('book1Title');
        res.body.answers[0].description.should.equals('book1Description');
        res.body.answers[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/1/120x250/preview.jpg`);
        res.body.answers[0].questionId.should.equals('100');
        res.body.answers[0].question.should.equals('Das ist eine Frage');
        res.body.answers[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[0].created.should.equals(555);

        res.body.answers[1].type.should.equals('CommitmentAnswer');
        res.body.answers[1].action.should.equals('created');
        res.body.answers[1].answerId.should.equals('2');
        res.body.answers[1].commitmentId.should.equals('20');
        res.body.answers[1].commitmentSlug.should.equals('das-ist-ein-commitment');
        res.body.answers[1].title.should.equals('Das ist ein Commitment');
        res.body.answers[1].description.should.equals('commitmentDescription');
        res.body.answers[1].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/20/120x120/title.jpg?v=606`);
        res.body.answers[1].questionId.should.equals('100');
        res.body.answers[1].question.should.equals('Das ist eine Frage');
        res.body.answers[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[1].regions.length.should.equals(1);
        res.body.answers[1].regions.should.includes('region-1');
        res.body.answers[1].created.should.equals(554);

        res.body.answers[2].type.should.equals('Link');
        res.body.answers[2].pageType.should.equals('blog');
        res.body.answers[2].action.should.equals('created');
        res.body.answers[2].answerId.should.equals('3');
        res.body.answers[2].title.should.equals('link3Title');
        res.body.answers[2].description.should.equals('link3Description');
        res.body.answers[2].link.should.equals('https://example.com');
        res.body.answers[2].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/3/120x120/preview.jpg`);
        res.body.answers[2].questionId.should.equals('100');
        res.body.answers[2].question.should.equals('Das ist eine Frage');
        res.body.answers[2].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[2].created.should.equals(553);

        res.body.answers[3].type.should.equals('Text');
        res.body.answers[3].action.should.equals('created');
        res.body.answers[3].answerId.should.equals('4');
        res.body.answers[3].answer.should.equals('Answer');
        res.body.answers[3].questionId.should.equals('100');
        res.body.answers[3].question.should.equals('Das ist eine Frage');
        res.body.answers[3].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[3].created.should.equals(552);

        res.body.answers[4].type.should.equals('Youtube');
        res.body.answers[4].action.should.equals('created');
        res.body.answers[4].answerId.should.equals('5');
        res.body.answers[4].title.should.equals('youtube5Title');
        res.body.answers[4].description.should.equals('youtube5Description');
        res.body.answers[4].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[4].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[4].link.should.equals('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        res.body.answers[4].questionId.should.equals('100');
        res.body.answers[4].question.should.equals('Das ist eine Frage');
        res.body.answers[4].questionSlug.should.equals('das-ist-eine-frage');
        res.body.answers[4].created.should.equals(551);
    });
});
