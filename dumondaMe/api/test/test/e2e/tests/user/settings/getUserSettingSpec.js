'use strict';

const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const should = require('chai').should();

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

        res.body.email.email.should.equal('user@irgendwo.ch');
        res.body.email.newEmailVerificationIsRunning.should.equal(false);
        should.not.exist(res.body.email.newEmail);

        res.body.languages.length.should.equal(1);
        res.body.languages[0].should.equal('de');

        res.body.emailNotifications.enabledEmailNotifications.should.equals(true);
        res.body.emailNotifications.enableInviteToAnswerQuestion.should.equals(true);
        res.body.emailNotifications.enableNewNotifications.should.equals(true);

        res.body.interestedTopics.length.should.equal(2);
        res.body.interestedTopics[0].id.should.equal('topic1');
        res.body.interestedTopics[0].description.should.equal('topic1De');
        res.body.interestedTopics[1].id.should.equal('topic22');
        res.body.interestedTopics[1].description.should.equal('topic22De');

        res.body.showProfileActivity.should.equal(false);
    });

    it('New email verification is running', async function () {
        dbDsl.newEmailRequest('1', {email: 'test@new.ch', verify: '3', created: 500});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/settings');
        res.status.should.equal(200);

        res.body.email.email.should.equal('user@irgendwo.ch');
        res.body.email.newEmail.should.equal('test@new.ch');
        res.body.email.newEmailVerificationIsRunning.should.equal(true);
    });

    it('Get disabled email notifications', async function () {
        dbDsl.disableEMailNotification('1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/settings');
        res.status.should.equal(200);

        res.body.emailNotifications.enabledEmailNotifications.should.equals(false);
        res.body.emailNotifications.enableInviteToAnswerQuestion.should.equals(true);
    });

    it('Get disabled email notifications for invited to answer question', async function () {
        dbDsl.disableInviteAnswerQuestionNotification('1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/settings');
        res.status.should.equal(200);

        res.body.emailNotifications.enabledEmailNotifications.should.equals(true);
        res.body.emailNotifications.enableInviteToAnswerQuestion.should.equals(false);
    });

    it('Get no user settings when not logged in', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/user/settings');
        res.status.should.equal(401);
    });
});
