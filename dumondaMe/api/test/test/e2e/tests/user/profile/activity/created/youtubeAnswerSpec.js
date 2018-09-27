'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed with created youtube answers for a user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
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
        dbDsl.createYoutubeAnswer('6', {
            creatorId: '3', questionId: '1', created: 601, idOnYoutube: '00zxopGPYW4',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW4', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW4'
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '1', questionId: '1', created: 602, idOnYoutube: '00zxopGPYW5',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW5', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW5'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Created youtube answer of a user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity',
            {guiLanguage: 'de', languages: ['de'], userId: '3'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Youtube');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].title.should.equals('youtube6Title');
        res.body.feed[0].description.should.equals('youtube6Description');
        res.body.feed[0].idOnYoutube.should.equals('00zxopGPYW4');
        res.body.feed[0].linkEmbed.should.equals('https://www.youtube.com/embed/00zxopGPYW4');
        res.body.feed[0].link.should.equals('https://www.youtube.com/watch?v=00zxopGPYW4');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(601);
        res.body.feed[0].isUpVotedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.name.should.equals('user Meier3');
        res.body.feed[0].user.slug.should.equals('user-meier3');
        res.body.feed[0].user.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Created youtube answer for logged in user', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity',
            {guiLanguage: 'de', languages: ['de'], userId: '1'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Youtube');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('7');
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });
});
