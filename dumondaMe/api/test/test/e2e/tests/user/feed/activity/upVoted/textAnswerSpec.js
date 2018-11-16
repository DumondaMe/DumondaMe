'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

//All test cases are the same as for book answers an are therefore tested in upVoted/bookAnswerSpec
describe('Get activity feed for up voted text answers', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createRegion('region-2', {de: 'region2De', en: 'region2En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world1',
            topics: ['topic1', 'topic3'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('6', {
            creatorId: '3', questionId: '1', answer: 'Answer www.dumonda.me', created: 600,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get up voted text answer', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('Text');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].numberOfUpVotes.should.equals(1);
        res.body.feed[0].isUpVotedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].answer.should.equals('Answer www.dumonda.me');
        res.body.feed[0].answerHtml.should.equals('Answer <a href="http://www.dumonda.me" class="linkified" target="_blank" rel="noopener">www.dumonda.me</a>');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].user.name.should.equals('user Meier4');
        res.body.feed[0].user.slug.should.equals('user-meier4');
        res.body.feed[0].user.userImage.should.equals('profileImage/4/thumbnail.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        res.body.feed[0].creator.userId.should.equals('3');
        res.body.feed[0].creator.name.should.equals('user Meier3');
        res.body.feed[0].creator.slug.should.equals('user-meier3');
        res.body.feed[0].creator.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].creator.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].creator.isLoggedInUser.should.equals(false);
        res.body.feed[0].creator.isTrustUser.should.equals(false);

        res.body.feed[1].type.should.equals('Text');
        res.body.feed[1].action.should.equals('created');

        res.body.feed[2].type.should.equals('Question');
        res.body.feed[2].action.should.equals('created');
    });

    it('Get only up voted text', async function () {
        dbDsl.createLinkAnswer('5', {
            creatorId: '3', questionId: '1', created: 601, pageType: 'article', hasPreviewImage: true,
            link: 'https://www.example.org/blog/1224'
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '2', questionId: '1', created: 603, idOnYoutube: '00zxopGPYW4',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW4', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW4'
        });
        dbDsl.createBookAnswer('8', {
            creatorId: '3', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.upVoteAnswer({userId: '4', answerId: '5', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], typeFilter: 'Text'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Text');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');

        res.body.feed[1].type.should.equals('Text');
        res.body.feed[1].action.should.equals('created');
    });
});
