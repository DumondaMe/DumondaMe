'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed with up voted book answers for a user', function () {

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
        dbDsl.createBookAnswer('6', {
            creatorId: '3', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createBookAnswer('7', {
            creatorId: '4', questionId: '1', created: 601, authors: 'Hans Wurst2', googleBookId: '1235',
            hasPreviewImage: true
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get by user up voted book answer', async function () {
        dbDsl.upVoteAnswer({userId: '5', answerId: '6', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity', {
            guiLanguage: 'de', languages: ['de'], userId: '5'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].title.should.equals('book6Title');
        res.body.feed[0].description.should.equals('book6Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/6/120x250/preview.jpg`);
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].numberOfUpVotes.should.equals(1);
        res.body.feed[0].isUpVotedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Get by logged in user up voted book answer', async function () {
        dbDsl.upVoteAnswer({userId: '1', answerId: '6', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity', {
            guiLanguage: 'de', languages: ['de'], userId: '1'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });
});
