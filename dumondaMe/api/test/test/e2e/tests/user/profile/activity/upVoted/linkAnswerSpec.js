'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Get activity feed with up voted link answers for a user', function () {

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
        dbDsl.createLinkAnswer('6', {
            creatorId: '3', questionId: '1', created: 601, pageType: 'article', hasPreviewImage: true,
            link: 'https://www.example.org/blog/1224'
        });
        dbDsl.createLinkAnswer('7', {
            creatorId: '4', questionId: '1', created: 602, pageType: 'website', hasPreviewImage: true,
            link: 'https://www.example.org/blog/12245'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get by user up voted link answer', async function () {
        dbDsl.upVoteAnswer({userId: '5', answerId: '6', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity', {
            guiLanguage: 'de', languages: ['de'], userId: '5'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Link');
        res.body.feed[0].pageType.should.equals('article');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].numberOfUpVotes.should.equals(1);
        res.body.feed[0].isUpVotedByUser.should.equals(false);
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].title.should.equals('link6Title');
        res.body.feed[0].description.should.equals('link6Description');
        res.body.feed[0].link.should.equals('https://www.example.org/blog/1224');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/6/460x460/preview.jpg`);
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        res.body.feed[0].creator.userId.should.equals('3');
        res.body.feed[0].creator.name.should.equals('user Meier3');
        res.body.feed[0].creator.slug.should.equals('user-meier3');
        res.body.feed[0].creator.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].creator.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].creator.isLoggedInUser.should.equals(false);
        res.body.feed[0].creator.isTrustUser.should.equals(false);
    });

    it('Get by logged in user up voted link answer', async function () {
        dbDsl.upVoteAnswer({userId: '1', answerId: '6', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity', {
            guiLanguage: 'de', languages: ['de'], userId: '1'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Link');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        res.body.feed[0].creator.userId.should.equals('3');
    });
});
