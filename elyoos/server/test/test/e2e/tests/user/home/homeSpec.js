'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Integration Tests for getting home screen information for a user', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(6).then(function () {
            dbDsl.createKeywords('Yoga');
            dbDsl.createKeywords('Meditation');
            dbDsl.createKeywords('Shop');

            dbDsl.createBookPage('0', ['de'], ['health', 'personalDevelopment'], 501, 'HansMuster', 1000);
            dbDsl.createLinkPage('2', ['de'], ['health', 'personalDevelopment'], 501, 'www.host.com/test', 200, 'linkPageTitle');
            dbDsl.createYoutubePage('1', ['de'], ['health', 'personalDevelopment'], 501, 'https://www.youtube.com/watch?v=hTarMdJub0M',
                'https://www.youtube.com/embed/hTarMdJub0M', 'youtubePage2Title');
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting the contacts who have added user since last login', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact('1', {profile: false, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact('2', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact('3', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact('4', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact('5', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact('6', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});

        dbDsl.createPrivacy(['2', '6'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['3'], 'Freund', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['4', '5'], 'Freund', {profile: false, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.setUserLastLoginTime(startTime - 604700);
        dbDsl.createContactConnection('2', '1', 'Freund', startTime - 1000);
        dbDsl.createContactConnection('1', '2', 'Freund', startTime - 1000);
        dbDsl.createContactConnection('3', '1', 'Freund', startTime - 604500);
        dbDsl.createContactConnection('4', '1', 'Freund', startTime - 604600);
        dbDsl.createContactConnection('5', '1', 'Freund', startTime - 604700);
        dbDsl.createContactConnection('6', '1', 'Freund', startTime - 604800);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.contacting.users.length.should.equals(3);
            res.body.contacting.users[0].userId.should.equals('2');
            res.body.contacting.users[0].name.should.equals('user Meier2');
            res.body.contacting.users[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.contacting.users[0].contactAdded.should.equals(startTime - 1000);
            res.body.contacting.users[0].contactOfUser.should.equals(true);

            res.body.contacting.users[1].userId.should.equals('3');
            res.body.contacting.users[1].name.should.equals('user Meier3');
            res.body.contacting.users[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
            res.body.contacting.users[1].contactAdded.should.equals(startTime - 604500);
            res.body.contacting.users[1].contactOfUser.should.equals(false);

            res.body.contacting.users[2].userId.should.equals('4');
            res.body.contacting.users[2].name.should.equals('user Meier4');
            res.body.contacting.users[2].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
            res.body.contacting.users[2].contactAdded.should.equals(startTime - 604600);
            res.body.contacting.users[2].contactOfUser.should.equals(false);

            res.body.contacting.numberOfContacting.should.equals(4);
        });
    });


    it('Showing recommendations for contact with pinwall visible for contact type', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);

        dbDsl.createPrivacyNoContact(null, {profile: false, image: false, profileData: true, contacts: true, pinwall: false});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Bekannter', {profile: true, image: true, profileData: true, contacts: true, pinwall: false});

        dbDsl.createContactConnection('2', '1', 'Freund', startTime);
        dbDsl.createContactConnection('1', '2', 'Freund', startTime);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(1);
        });
    });

    it('Showing recommendations of user with no contact relationships', function () {

        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: false});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(1);
        });
    });

    it('Showing recommendations which has correct visible for no contact visible setting', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);
        dbDsl.createPrivacyNoContact(null, {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: false});

        dbDsl.createContactConnection('1', '2', 'Freund', startTime);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(1);
        });
    });

    it('Not showing recommendations which has incorrect visible for contact', function () {

        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);
        dbDsl.createPrivacyNoContact(null, {profile: false, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: false});

        dbDsl.createContactConnection('2', '1', 'Freund', 500);
        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Not showing recommendation because contact has user blocked', function () {

        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);
        dbDsl.createPrivacyNoContact(null, {profile: false, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.blockUser('2', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Not showing recommendation because visible profile setting is false', function () {

        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);
        dbDsl.createPrivacyNoContact(null, {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: false, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createContactConnection('2', '1', 'Freund', 500);


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Not showing recommendation because visible no contact profile setting is false', function () {

        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);

        dbDsl.createPrivacyNoContact(null, {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '2', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Not showing recommendation because visible no contact profile setting is false (no contact relationship)', function () {

        dbDsl.crateRecommendationsForPage('0', [{userId: '2', created: 503}]);

        dbDsl.createPrivacyNoContact(null, {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Getting user blogs, contact blogs and recommendations', function () {

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['3'], {profile: true, image: true, profileData: true, contacts: true, pinwall: false});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Bekannter', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createBlog('3', '2', ['en'], ['health', 'personalDevelopment'], 501, ['Freund'], 400, 'blogTitle1');
        dbDsl.createBlog('4', '2', ['en'], ['health', 'personalDevelopment'], 502, ['Freund'], null, 'blogTitle2');
        dbDsl.createBlog('5', '1', ['en'], ['health', 'personalDevelopment'], 505, null, null, 'blogTitle3');
        dbDsl.createBlog('6', '3', ['en'], ['health', 'personalDevelopment'], 1000, null, null, 'blogTitle4');
        dbDsl.createBlog('7', '3', ['en'], ['health', 'personalDevelopment'], 507, ['Freund'], null, 'blogTitle5');

        dbDsl.createGenericPage('8', '2', ['de'], ['health', 'personalDevelopment'], 100, 'Test1Place', [{
            description: 'Zuerich',
            lat: 47.376887,
            lng: 8.541694
        }]);

        dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 503, comment: 'irgendwas'}, {userId: '2', created: 502}]);
        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 504, comment: 'irgendwas2'}, {userId: '3', created: 504}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 499, comment: 'irgendwas2'}]);
        dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 498, comment: 'irgendwas3'}]);

        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createContactConnection('1', '3', 'Bekannter', 500);
        dbDsl.createContactConnection('2', '1', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(8);
            res.body.pinwall[0].pinwallType.should.equals('Blog');
            res.body.pinwall[0].pageId.should.equals('6');
            res.body.pinwall[0].name.should.equals('user Meier3');
            res.body.pinwall[0].forename.should.equals('user');
            res.body.pinwall[0].userId.should.equals('3');
            res.body.pinwall[0].title.should.equals('blogTitle4');
            res.body.pinwall[0].created.should.equals(1000);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
            should.not.exist(res.body.pinwall[0].url);
            res.body.pinwall[0].title.should.equals('blogTitle4');
            res.body.pinwall[0].text.should.equals('blog6Text');
            res.body.pinwall[0].isAdmin.should.equals(false);
            res.body.pinwall[0].isPublic.should.equals(true);
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].pinwallType.should.equals('Blog');
            res.body.pinwall[1].pageId.should.equals('5');
            res.body.pinwall[1].name.should.equals('user Meier');
            res.body.pinwall[1].forename.should.equals('user');
            res.body.pinwall[1].userId.should.equals('1');
            res.body.pinwall[1].created.should.equals(505);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            should.not.exist(res.body.pinwall[1].url);
            res.body.pinwall[1].title.should.equals('blogTitle3');
            res.body.pinwall[1].text.should.equals('blog5Text');
            res.body.pinwall[1].isAdmin.should.equals(true);
            res.body.pinwall[1].isPublic.should.equals(true);
            res.body.pinwall[1].topic.length.should.equals(2);
            res.body.pinwall[1].topic[0].should.equals('health');
            res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals('Youtube');
            res.body.pinwall[2].link.should.equals('https://www.youtube.com/watch?v=hTarMdJub0M');
            res.body.pinwall[2].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
            res.body.pinwall[2].pageId.should.equals('1');
            res.body.pinwall[2].name.should.equals('user Meier2');
            res.body.pinwall[2].forename.should.equals('user');
            res.body.pinwall[2].userId.should.equals('2');
            res.body.pinwall[2].title.should.equals('youtubePage2Title');
            res.body.pinwall[2].created.should.equals(504);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[2].description.should.equals('page1Description');
            res.body.pinwall[2].recommendedByUser.should.equals(false);
            res.body.pinwall[2].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[2].numberOfRecommendations.should.equals(2);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals('Book');
            res.body.pinwall[3].pageId.should.equals('0');
            res.body.pinwall[3].name.should.equals('user Meier');
            res.body.pinwall[3].forename.should.equals('user');
            res.body.pinwall[3].userId.should.equals('1');
            res.body.pinwall[3].title.should.equals('page0Title');
            res.body.pinwall[3].created.should.equals(503);
            res.body.pinwall[3].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[3].bookPreviewUrl.should.equals('pages/0/pagePreview.jpg');
            res.body.pinwall[3].description.should.equals('page0Description');
            res.body.pinwall[3].recommendedByUser.should.equals(true);
            res.body.pinwall[3].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[3].numberOfRecommendations.should.equals(2);
            res.body.pinwall[3].userRecommendationId.should.equals('0');
            res.body.pinwall[3].topic.length.should.equals(2);
            res.body.pinwall[3].topic[0].should.equals('health');
            res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[4].pinwallType.should.equals('Blog');
            res.body.pinwall[4].pageId.should.equals('4');
            res.body.pinwall[4].name.should.equals('user Meier2');
            res.body.pinwall[4].forename.should.equals('user');
            res.body.pinwall[4].userId.should.equals('2');
            res.body.pinwall[4].created.should.equals(502);
            res.body.pinwall[4].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            should.not.exist(res.body.pinwall[4].url);
            should.not.exist(res.body.pinwall[4].urlFull);
            res.body.pinwall[4].title.should.equals('blogTitle2');
            res.body.pinwall[4].text.should.equals('blog4Text');
            res.body.pinwall[4].isAdmin.should.equals(false);
            res.body.pinwall[4].isPublic.should.equals(false);
            res.body.pinwall[4].topic.length.should.equals(2);
            res.body.pinwall[4].topic[0].should.equals('health');
            res.body.pinwall[4].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[5].pinwallType.should.equals('Blog');
            res.body.pinwall[5].pageId.should.equals('3');
            res.body.pinwall[5].name.should.equals('user Meier2');
            res.body.pinwall[5].forename.should.equals('user');
            res.body.pinwall[5].userId.should.equals('2');
            res.body.pinwall[5].created.should.equals(501);
            res.body.pinwall[5].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[5].url.should.equals('blog/3/preview.jpg');
            res.body.pinwall[5].title.should.equals('blogTitle1');
            res.body.pinwall[5].text.should.equals('blog3Text');
            res.body.pinwall[5].isAdmin.should.equals(false);
            res.body.pinwall[5].isPublic.should.equals(false);
            res.body.pinwall[5].topic.length.should.equals(2);
            res.body.pinwall[5].topic[0].should.equals('health');
            res.body.pinwall[5].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[6].pinwallType.should.equals('Recommendation');
            res.body.pinwall[6].label.should.equals('Link');
            res.body.pinwall[6].pageId.should.equals('2');
            res.body.pinwall[6].name.should.equals('user Meier2');
            res.body.pinwall[6].forename.should.equals('user');
            res.body.pinwall[6].link.should.equals('www.host.com/test');
            res.body.pinwall[6].hostname.should.equals('www.host.com');
            res.body.pinwall[6].userId.should.equals('2');
            res.body.pinwall[6].title.should.equals('linkPageTitle');
            res.body.pinwall[6].created.should.equals(499);
            res.body.pinwall[6].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[6].linkPreviewUrl.should.equals('pages/2/preview.jpg');
            res.body.pinwall[6].heightPreviewImage.should.equals(200);
            res.body.pinwall[6].description.should.equals('page2Description');
            res.body.pinwall[6].recommendedByUser.should.equals(false);
            res.body.pinwall[6].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[6].numberOfRecommendations.should.equals(1);
            res.body.pinwall[6].topic.length.should.equals(2);
            res.body.pinwall[6].topic[0].should.equals('health');
            res.body.pinwall[6].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[7].pinwallType.should.equals('Recommendation');
            res.body.pinwall[7].label.should.equals('Generic');
            res.body.pinwall[7].pageId.should.equals('8');
            res.body.pinwall[7].name.should.equals('user Meier2');
            res.body.pinwall[7].forename.should.equals('user');
            res.body.pinwall[7].userId.should.equals('2');
            res.body.pinwall[7].title.should.equals('Test1Place');
            res.body.pinwall[7].created.should.equals(498);
            res.body.pinwall[7].previewImage.should.equals('pages/8/preview.jpg');
            res.body.pinwall[7].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[7].description.should.equals('page8Description');
            res.body.pinwall[7].recommendedByUser.should.equals(false);
            res.body.pinwall[7].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[7].numberOfRecommendations.should.equals(1);
            res.body.pinwall[7].topic.length.should.equals(2);
            res.body.pinwall[7].topic[0].should.equals('health');
            res.body.pinwall[7].topic[1].should.equals('personalDevelopment');
        });
    });

    it('Getting user blogs, contact blogs and recommendations (show not only contacts)', function () {

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['3'], {profile: true, image: true, profileData: true, contacts: true, pinwall: false});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Bekannter', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createBlog('3', '2', ['en'], ['health', 'personalDevelopment'], 501, ['Freund'], 400, 'blogTitle1');
        dbDsl.createBlog('4', '2', ['en'], ['health', 'personalDevelopment'], 502, ['Freund'], null, 'blogTitle2');
        dbDsl.createBlog('5', '1', ['en'], ['health', 'personalDevelopment'], 505, null, null, 'blogTitle3');
        dbDsl.createBlog('6', '3', ['en'], ['health', 'personalDevelopment'], 1000, null, null, 'blogTitle4');
        dbDsl.createBlog('7', '3', ['en'], ['health', 'personalDevelopment'], 507, ['Freund'], null, 'blogTitle5');

        dbDsl.createGenericPage('8', '2', ['de'], ['health', 'personalDevelopment'], 100, 'Test1Place', [{
            description: 'Zuerich',
            lat: 47.376887,
            lng: 8.541694
        }]);

        dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 503, comment: 'irgendwas'}, {userId: '2', created: 502}]);
        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 504, comment: 'irgendwas2'}, {userId: '3', created: 504}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 499, comment: 'irgendwas2'}]);
        dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 498, comment: 'irgendwas3'}]);

        dbDsl.createContactConnection('1', '3', 'Bekannter', 500);
        dbDsl.createContactConnection('2', '1', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(8);
            res.body.pinwall[0].pinwallType.should.equals('Blog');
            res.body.pinwall[0].pageId.should.equals('6');
            res.body.pinwall[0].name.should.equals('user Meier3');
            res.body.pinwall[0].forename.should.equals('user');
            res.body.pinwall[0].userId.should.equals('3');
            res.body.pinwall[0].title.should.equals('blogTitle4');
            res.body.pinwall[0].created.should.equals(1000);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
            should.not.exist(res.body.pinwall[0].url);
            res.body.pinwall[0].title.should.equals('blogTitle4');
            res.body.pinwall[0].text.should.equals('blog6Text');
            res.body.pinwall[0].isAdmin.should.equals(false);
            res.body.pinwall[0].isPublic.should.equals(true);
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].pinwallType.should.equals('Blog');
            res.body.pinwall[1].pageId.should.equals('5');
            res.body.pinwall[1].name.should.equals('user Meier');
            res.body.pinwall[1].forename.should.equals('user');
            res.body.pinwall[1].userId.should.equals('1');
            res.body.pinwall[1].created.should.equals(505);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            should.not.exist(res.body.pinwall[1].url);
            res.body.pinwall[1].title.should.equals('blogTitle3');
            res.body.pinwall[1].text.should.equals('blog5Text');
            res.body.pinwall[1].isAdmin.should.equals(true);
            res.body.pinwall[1].isPublic.should.equals(true);
            res.body.pinwall[1].topic.length.should.equals(2);
            res.body.pinwall[1].topic[0].should.equals('health');
            res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals('Youtube');
            res.body.pinwall[2].link.should.equals('https://www.youtube.com/watch?v=hTarMdJub0M');
            res.body.pinwall[2].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
            res.body.pinwall[2].pageId.should.equals('1');
            res.body.pinwall[2].name.should.equals('user Meier2');
            res.body.pinwall[2].forename.should.equals('user');
            res.body.pinwall[2].userId.should.equals('2');
            res.body.pinwall[2].title.should.equals('youtubePage2Title');
            res.body.pinwall[2].created.should.equals(504);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[2].description.should.equals('page1Description');
            res.body.pinwall[2].recommendedByUser.should.equals(false);
            res.body.pinwall[2].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[2].numberOfRecommendations.should.equals(2);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals('Book');
            res.body.pinwall[3].pageId.should.equals('0');
            res.body.pinwall[3].name.should.equals('user Meier');
            res.body.pinwall[3].forename.should.equals('user');
            res.body.pinwall[3].userId.should.equals('1');
            res.body.pinwall[3].title.should.equals('page0Title');
            res.body.pinwall[3].created.should.equals(503);
            res.body.pinwall[3].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[3].bookPreviewUrl.should.equals('pages/0/pagePreview.jpg');
            res.body.pinwall[3].description.should.equals('page0Description');
            res.body.pinwall[3].recommendedByUser.should.equals(true);
            res.body.pinwall[3].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[3].numberOfRecommendations.should.equals(2);
            res.body.pinwall[3].userRecommendationId.should.equals('0');
            res.body.pinwall[3].topic.length.should.equals(2);
            res.body.pinwall[3].topic[0].should.equals('health');
            res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[4].pinwallType.should.equals('Blog');
            res.body.pinwall[4].pageId.should.equals('4');
            res.body.pinwall[4].name.should.equals('user Meier2');
            res.body.pinwall[4].forename.should.equals('user');
            res.body.pinwall[4].userId.should.equals('2');
            res.body.pinwall[4].created.should.equals(502);
            res.body.pinwall[4].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            should.not.exist(res.body.pinwall[4].url);
            should.not.exist(res.body.pinwall[4].urlFull);
            res.body.pinwall[4].title.should.equals('blogTitle2');
            res.body.pinwall[4].text.should.equals('blog4Text');
            res.body.pinwall[4].isAdmin.should.equals(false);
            res.body.pinwall[4].isPublic.should.equals(false);
            res.body.pinwall[4].topic.length.should.equals(2);
            res.body.pinwall[4].topic[0].should.equals('health');
            res.body.pinwall[4].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[5].pinwallType.should.equals('Blog');
            res.body.pinwall[5].pageId.should.equals('3');
            res.body.pinwall[5].name.should.equals('user Meier2');
            res.body.pinwall[5].forename.should.equals('user');
            res.body.pinwall[5].userId.should.equals('2');
            res.body.pinwall[5].created.should.equals(501);
            res.body.pinwall[5].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[5].url.should.equals('blog/3/preview.jpg');
            res.body.pinwall[5].title.should.equals('blogTitle1');
            res.body.pinwall[5].text.should.equals('blog3Text');
            res.body.pinwall[5].isAdmin.should.equals(false);
            res.body.pinwall[5].isPublic.should.equals(false);
            res.body.pinwall[5].topic.length.should.equals(2);
            res.body.pinwall[5].topic[0].should.equals('health');
            res.body.pinwall[5].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[6].pinwallType.should.equals('Recommendation');
            res.body.pinwall[6].label.should.equals('Link');
            res.body.pinwall[6].pageId.should.equals('2');
            res.body.pinwall[6].name.should.equals('user Meier2');
            res.body.pinwall[6].forename.should.equals('user');
            res.body.pinwall[6].link.should.equals('www.host.com/test');
            res.body.pinwall[6].hostname.should.equals('www.host.com');
            res.body.pinwall[6].userId.should.equals('2');
            res.body.pinwall[6].title.should.equals('linkPageTitle');
            res.body.pinwall[6].created.should.equals(499);
            res.body.pinwall[6].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[6].linkPreviewUrl.should.equals('pages/2/preview.jpg');
            res.body.pinwall[6].heightPreviewImage.should.equals(200);
            res.body.pinwall[6].description.should.equals('page2Description');
            res.body.pinwall[6].recommendedByUser.should.equals(false);
            res.body.pinwall[6].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[6].numberOfRecommendations.should.equals(1);
            res.body.pinwall[6].topic.length.should.equals(2);
            res.body.pinwall[6].topic[0].should.equals('health');
            res.body.pinwall[6].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[7].pinwallType.should.equals('Recommendation');
            res.body.pinwall[7].label.should.equals('Generic');
            res.body.pinwall[7].pageId.should.equals('8');
            res.body.pinwall[7].name.should.equals('user Meier2');
            res.body.pinwall[7].forename.should.equals('user');
            res.body.pinwall[7].userId.should.equals('2');
            res.body.pinwall[7].title.should.equals('Test1Place');
            res.body.pinwall[7].created.should.equals(498);
            res.body.pinwall[7].previewImage.should.equals('pages/8/preview.jpg');
            res.body.pinwall[7].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[7].description.should.equals('page8Description');
            res.body.pinwall[7].recommendedByUser.should.equals(false);
            res.body.pinwall[7].thisRecommendationByUser.should.equals(false);
            res.body.pinwall[7].numberOfRecommendations.should.equals(1);
            res.body.pinwall[7].topic.length.should.equals(2);
            res.body.pinwall[7].topic[0].should.equals('health');
            res.body.pinwall[7].topic[1].should.equals('personalDevelopment');
        });
    });
});
