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

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description',
            topic: ['spiritual', 'education'], language: 'de', modified: 700
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
            creatorId: '2', questionId: '1', created: 498,
            link: 'https://example.com', pageType: 'blog'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting details of a question without answers', async function () {
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2',
            topic: ['health'], language: 'en', modified: 701
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/detail/2');
        res.status.should.equal(200);
        res.body.question.should.equals('Das ist eine Frage2');
        res.body.description.should.equals('description2');
        res.body.created.should.equals(500);
        res.body.modified.should.equals(701);
        res.body.language.should.equals('en');
        res.body.creator.name.should.equals('user Meier3');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
        res.body.topic.length.should.equals(1);
        res.body.topic[0].should.equals('health');

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
        res.body.creator.name.should.equals('user Meier2');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.topic.length.should.equals(2);
        res.body.topic[0].should.equals('spiritual');
        res.body.topic[1].should.equals('education');

        res.body.answers.length.should.equals(4);
        res.body.answers[0].answerId.should.equals('5');
        res.body.answers[0].answerType.should.equals('Text');
        res.body.answers[0].answer.should.equals('Answer');
        res.body.answers[0].upVotes.should.equals(0);
        res.body.answers[0].isAdmin.should.equals(true);
        res.body.answers[0].hasVoted.should.equals(false);
        res.body.answers[0].created.should.equals(600);
        res.body.answers[0].creator.name.should.equals('user Meier');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        res.body.answers[1].answerId.should.equals('6');
        res.body.answers[1].answerType.should.equals('Text');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(0);
        res.body.answers[1].isAdmin.should.equals(false);
        res.body.answers[1].hasVoted.should.equals(false);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].answerId.should.equals('7');
        res.body.answers[2].answerType.should.equals('Youtube');
        res.body.answers[2].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[2].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[2].title.should.equals('youtube7Title');
        res.body.answers[2].description.should.equals('youtube7Description');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].isAdmin.should.equals(false);
        res.body.answers[2].hasVoted.should.equals(false);
        res.body.answers[2].created.should.equals(499);
        res.body.answers[2].creator.name.should.equals('user Meier2');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[3].answerId.should.equals('8');
        res.body.answers[3].answerType.should.equals('Link');
        res.body.answers[3].link.should.equals('https://example.com');
        res.body.answers[3].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/120x120/link/8/preview.jpg`);
        res.body.answers[3].title.should.equals('link8Title');
        res.body.answers[3].description.should.equals('link8Description');
        res.body.answers[3].pageType.should.equals('blog');
        res.body.answers[3].upVotes.should.equals(0);
        res.body.answers[3].isAdmin.should.equals(false);
        res.body.answers[3].hasVoted.should.equals(false);
        res.body.answers[3].created.should.equals(498);
        res.body.answers[3].creator.name.should.equals('user Meier2');
        res.body.answers[3].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
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
        res.body.creator.name.should.equals('user Meier2');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.topic.length.should.equals(2);
        res.body.topic[0].should.equals('spiritual');
        res.body.topic[1].should.equals('education');

        res.body.answers.length.should.equals(4);
        res.body.answers[0].answerId.should.equals('7');
        res.body.answers[0].answerType.should.equals('Youtube');
        res.body.answers[0].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[0].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[0].title.should.equals('youtube7Title');
        res.body.answers[0].description.should.equals('youtube7Description');
        res.body.answers[0].upVotes.should.equals(2);
        res.body.answers[0].isAdmin.should.equals(false);
        res.body.answers[0].hasVoted.should.equals(false);
        res.body.answers[0].created.should.equals(499);
        res.body.answers[0].creator.name.should.equals('user Meier2');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[1].answerId.should.equals('6');
        res.body.answers[1].answerType.should.equals('Text');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(1);
        res.body.answers[1].isAdmin.should.equals(false);
        res.body.answers[1].hasVoted.should.equals(true);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].answerId.should.equals('5');
        res.body.answers[2].answerType.should.equals('Text');
        res.body.answers[2].answer.should.equals('Answer');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].isAdmin.should.equals(true);
        res.body.answers[2].hasVoted.should.equals(false);
        res.body.answers[2].created.should.equals(600);
        res.body.answers[2].creator.name.should.equals('user Meier');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        res.body.answers[3].answerId.should.equals('8');
        res.body.answers[3].answerType.should.equals('Link');
        res.body.answers[3].link.should.equals('https://example.com');
        res.body.answers[3].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/120x120/link/8/preview.jpg`);
        res.body.answers[3].title.should.equals('link8Title');
        res.body.answers[3].description.should.equals('link8Description');
        res.body.answers[3].pageType.should.equals('blog');
        res.body.answers[3].upVotes.should.equals(0);
        res.body.answers[3].isAdmin.should.equals(false);
        res.body.answers[3].hasVoted.should.equals(false);
        res.body.answers[3].created.should.equals(498);
        res.body.answers[3].creator.name.should.equals('user Meier2');
        res.body.answers[3].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
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
        res.body.creator.name.should.equals('user Meier2');
        //@todo test with new privacy settings
        res.body.creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.topic.length.should.equals(2);
        res.body.topic[0].should.equals('spiritual');
        res.body.topic[1].should.equals('education');

        res.body.answers.length.should.equals(4);
        res.body.answers[0].answerId.should.equals('5');
        res.body.answers[0].answerType.should.equals('Text');
        res.body.answers[0].answer.should.equals('Answer');
        res.body.answers[0].upVotes.should.equals(0);
        res.body.answers[0].isAdmin.should.equals(false);
        res.body.answers[0].hasVoted.should.equals(false);
        res.body.answers[0].created.should.equals(600);
        res.body.answers[0].creator.name.should.equals('user Meier');
        res.body.answers[0].creator.thumbnailUrl.should.equals('profileImage/1/thumbnail.jpg');

        res.body.answers[1].answerId.should.equals('6');
        res.body.answers[1].answerType.should.equals('Text');
        res.body.answers[1].answer.should.equals('Answer2');
        res.body.answers[1].upVotes.should.equals(0);
        res.body.answers[1].isAdmin.should.equals(false);
        res.body.answers[1].hasVoted.should.equals(false);
        res.body.answers[1].created.should.equals(500);
        res.body.answers[1].creator.name.should.equals('user Meier3');
        res.body.answers[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.answers[2].answerId.should.equals('7');
        res.body.answers[2].answerType.should.equals('Youtube');
        res.body.answers[2].idOnYoutube.should.equals('Lhku7ZBWEK8');
        res.body.answers[2].linkEmbed.should.equals('https://www.youtube.com/embed/Lhku7ZBWEK8');
        res.body.answers[2].title.should.equals('youtube7Title');
        res.body.answers[2].description.should.equals('youtube7Description');
        res.body.answers[2].upVotes.should.equals(0);
        res.body.answers[2].isAdmin.should.equals(false);
        res.body.answers[2].hasVoted.should.equals(false);
        res.body.answers[2].created.should.equals(499);
        res.body.answers[2].creator.name.should.equals('user Meier2');
        res.body.answers[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.answers[3].answerId.should.equals('8');
        res.body.answers[3].answerType.should.equals('Link');
        res.body.answers[3].link.should.equals('https://example.com');
        res.body.answers[3].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/120x120/link/8/preview.jpg`);
        res.body.answers[3].title.should.equals('link8Title');
        res.body.answers[3].description.should.equals('link8Description');
        res.body.answers[3].pageType.should.equals('blog');
        res.body.answers[3].upVotes.should.equals(0);
        res.body.answers[3].isAdmin.should.equals(false);
        res.body.answers[3].hasVoted.should.equals(false);
        res.body.answers[3].created.should.equals(498);
        res.body.answers[3].creator.name.should.equals('user Meier2');
        res.body.answers[3].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
    });
});
