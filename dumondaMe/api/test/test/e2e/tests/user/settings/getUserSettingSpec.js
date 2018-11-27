'use strict';

let users = require('dumonda-me-server-test-util').user;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Getting user setting', function () {

    beforeEach(async function () {
        await dbDsl.init(8);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic21', descriptionDe: 'topic21De', descriptionEn: 'topic21En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic22', descriptionDe: 'topic22De', descriptionEn: 'topic22En'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get user settings when logged in', async function () {
        dbDsl.setUserProfileActivityPrivacy('1', {showProfileActivity: false});
        dbDsl.interestedTopics('1', {topics: ['topic1', 'topic22']});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/settings');
        res.status.should.equal(200);
        res.body.privacyMode.should.equal('public');

        res.body.languages.length.should.equal(1);
        res.body.languages[0].should.equal('de');

        res.body.interestedTopics.length.should.equal(2);
        res.body.interestedTopics[0].id.should.equal('topic1');
        res.body.interestedTopics[0].description.should.equal('topic1De');
        res.body.interestedTopics[1].id.should.equal('topic22');
        res.body.interestedTopics[1].description.should.equal('topic22De');

        res.body.showProfileActivity.should.equal(false);
    });

    it('Get no user settings when not logged in', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/settings');
        res.status.should.equal(401);
    });
});
