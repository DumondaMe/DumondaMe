'use strict';

let users = require('dumonda-me-server-test-util').user;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Suggestion of other users for trust circle and ignoring the own trust circle', function () {

    beforeEach(async function () {
        await dbDsl.init(11);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Ignore users trust circle for suggestion', async function () {
        dbDsl.createRegion('international', {de: 'internationalDe', en: 'internationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});
        dbDsl.createRegion('region-2', {parentRegionId: 'international', de: 'Region2De', en: 'Region2En'});
        dbDsl.createRegion('region-3', {parentRegionId: 'international', de: 'Region3De', en: 'Region3En'});

        dbDsl.interestedRegions('1', {regions: ['region-1', 'region-3']});
        dbDsl.interestedRegions('6', {regions: ['region-1', 'region-2', 'region-3']});
        dbDsl.interestedRegions('5', {regions: ['region-1', 'region-2']});
        dbDsl.interestedRegions('9', {regions: ['region-1', 'region-2']});

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic21', descriptionDe: 'topic21De', descriptionEn: 'topic21En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic22', descriptionDe: 'topic22De', descriptionEn: 'topic22En'
        });

        dbDsl.interestedTopics('1', {topics: ['topic1', 'topic21']});
        dbDsl.interestedTopics('6', {topics: ['topic1', 'topic21', 'topic22']});
        dbDsl.interestedTopics('5', {topics: ['topic1', 'topic22']});
        dbDsl.interestedTopics('9', {topics: ['topic1', 'topic21']});

        dbDsl.createContactConnection('1', '2');
        dbDsl.createContactConnection('1', '3');

        dbDsl.createContactConnection('2', '5');
        dbDsl.createContactConnection('3', '5');
        dbDsl.createContactConnection('4', '5');

        dbDsl.createContactConnection('8', '6');
        dbDsl.createContactConnection('7', '6');

        dbDsl.createContactConnection('10', '9');
        dbDsl.createContactConnection('11', '9');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/otherUser/suggestionIgnoreTrustCircle', {skip: 0, limit: 2});
        res.status.should.equal(200);

        res.body.trustCircleSuggestion.should.equal(false);
        res.body.hasMoreUsers.should.equal(true);
        res.body.users.length.should.equal(2);
        res.body.users[0].userId.should.equal('6');
        res.body.users[0].name.should.equal('user Meier6');
        res.body.users[0].numberOfIntersectingTrustCircle.should.equal(0);
        res.body.users[0].slug.should.equal('user-meier6');
        res.body.users[0].profileUrl.should.equal('profileImage/6/thumbnail.jpg');

        res.body.users[1].userId.should.equal('9');
        res.body.users[1].name.should.equal('user Meier9');
        res.body.users[1].numberOfIntersectingTrustCircle.should.equal(0);
        res.body.users[1].slug.should.equal('user-meier9');
        res.body.users[1].profileUrl.should.equal('profileImage/9/thumbnail.jpg');

    });

    it('Do not show user when privacy setting of user is set to onlyContact', async function () {
        dbDsl.createRegion('international', {de: 'internationalDe', en: 'internationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.interestedRegions('1', {regions: ['region-1']});
        dbDsl.interestedRegions('5', {regions: ['region-1']});
        dbDsl.interestedRegions('6', {regions: ['region-1']});

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.interestedTopics('1', {topics: ['topic1']});
        dbDsl.interestedTopics('6', {topics: ['topic1']});
        dbDsl.interestedTopics('5', {topics: ['topic1']});

        dbDsl.createContactConnection('2', '5');
        dbDsl.createContactConnection('2', '6');

        dbDsl.setUserPrivacy('6', {privacyMode: 'onlyContact'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/otherUser/suggestionIgnoreTrustCircle', {skip: 0, limit: 10});
        res.status.should.equal(200);

        res.body.trustCircleSuggestion.should.equal(false);
        res.body.hasMoreUsers.should.equal(false);
        res.body.users.length.should.equal(1);
        res.body.users[0].userId.should.equal('5');
        res.body.users[0].profileUrl.should.equal('profileImage/5/thumbnail.jpg');
    });
});
