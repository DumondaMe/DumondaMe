'use strict';

let libUser = require('elyoos-server-lib').user();
let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Integration Tests for getting the pinwall of another user', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        libUser.removeFromCache('userchange@irgendwo.ch');

        return dbDsl.init(3).then(function () {
            let startTime = Math.floor(moment.utc().valueOf() / 1000);
            dbDsl.createPrivacyNoContact(['1'], {profile: false, image: false, profileData: false, contacts: false, pinwall: false});
            dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: false, pinwall: true});

            dbDsl.createContactConnection('1', '2', 'Freund', startTime - 86401);

            dbDsl.createBlog('1', {blogWriterUserId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], visible: ['Freund'], created: 506});
            dbDsl.createBlog('2', {blogWriterUserId: '2', language: ['de'], topic: ['health', 'spiritual'], created: 505, pictureHeight: 400});
            dbDsl.createBlog('3', {blogWriterUserId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 507});
            dbDsl.createBlog('4', {blogWriterUserId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 502, pictureHeight: 200});

            dbDsl.createBookPage('5', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 510, author: 'Hans Muster', publishDate: 1000});
            dbDsl.createBookPage('6', {adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 511, author: 'Hans Muster', publishDate: 1000});
            dbDsl.createYoutubePage('7', {
                adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 512, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
            dbDsl.createYoutubePage('8', {
                adminId: '2', language: ['de'], topic: ['socialDevelopment', 'personalDevelopment'], created: 513, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
            dbDsl.createLinkPage('9',
                {adminId: '2', language: ['de'], topic: ['socialDevelopment', 'personalDevelopment'], created: 514, link: 'www.host.com/test', heightPreviewImage: 200});

            dbDsl.crateRecommendationsForBlog('1', [{userId: '1', created: 509}]);
            dbDsl.crateRecommendationsForBlog('4', [{userId: '2', created: 508}]);

            dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 505}]);
            dbDsl.crateRecommendationsForPage('6', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('7', [{userId: '1', created: 504}]);
            dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 503}]);
            dbDsl.crateRecommendationsForPage('9', [{userId: '1', created: 501}, {userId: '2', created: 502}]);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the pinwall of another user - Return a 200', function () {

        dbDsl.createPrivacy(['2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['2'], {profile: false, image: true, profileData: true, contacts: false, pinwall: false});
        dbDsl.createContactConnection('2', '1', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(6);

                res.body.pinwall[0].pinwallType.should.equals('Recommendation');
                res.body.pinwall[0].label.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('4');
                res.body.pinwall[0].writerName.should.equals('user Meier');
                res.body.pinwall[0].writerUserId.should.equals('1');
                res.body.pinwall[0].name.should.equals('user Meier2');
                res.body.pinwall[0].userId.should.equals('2');
                res.body.pinwall[0].recommendedByUser.should.equals(false);
                res.body.pinwall[0].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[0].created.should.equals(508);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[0].heightPreviewImage.should.equals(200);
                res.body.pinwall[0].previewUrl.should.equals('blog/4/preview.jpg');
                res.body.pinwall[0].urlFull.should.equals('blog/4/normal.jpg');
                res.body.pinwall[0].text.should.equals('blog4Text');
                res.body.pinwall[0].isAdmin.should.equals(true);
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('health');
                res.body.pinwall[0].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[0].totalNumberOfRecommendations.should.equals(1);

                res.body.pinwall[1].pinwallType.should.equals('Blog');
                res.body.pinwall[1].pageId.should.equals('1');
                res.body.pinwall[1].name.should.equals('user Meier2');
                res.body.pinwall[1].userId.should.equals('2');
                res.body.pinwall[1].title.should.equals('blog1Title');
                res.body.pinwall[1].created.should.equals(506);
                res.body.pinwall[1].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                should.not.exist(res.body.pinwall[1].previewUrl);
                should.not.exist(res.body.pinwall[1].urlFull);
                res.body.pinwall[1].text.should.equals('blog1Text');
                res.body.pinwall[1].isAdmin.should.equals(false);
                res.body.pinwall[1].isPublic.should.equals(false);
                res.body.pinwall[1].recommendedByUser.should.equals(true);
                res.body.pinwall[1].userRecommendationId.should.equals('0');
                res.body.pinwall[1].totalNumberOfRecommendations.should.equals(1);
                res.body.pinwall[1].topic.length.should.equals(2);
                res.body.pinwall[1].topic[0].should.equals('health');
                res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[2].pinwallType.should.equals('Blog');
                res.body.pinwall[2].pageId.should.equals('2');
                res.body.pinwall[2].name.should.equals('user Meier2');
                res.body.pinwall[2].userId.should.equals('2');
                res.body.pinwall[2].title.should.equals('blog2Title');
                res.body.pinwall[2].created.should.equals(505);
                res.body.pinwall[2].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[2].previewUrl.should.equals('blog/2/preview.jpg');
                res.body.pinwall[2].text.should.equals('blog2Text');
                res.body.pinwall[2].recommendedByUser.should.equals(false);
                res.body.pinwall[2].totalNumberOfRecommendations.should.equals(0);
                res.body.pinwall[2].isAdmin.should.equals(false);
                res.body.pinwall[2].isPublic.should.equals(true);
                res.body.pinwall[2].topic.length.should.equals(2);
                res.body.pinwall[2].topic[0].should.equals('health');
                res.body.pinwall[2].topic[1].should.equals('spiritual');

                res.body.pinwall[3].pinwallType.should.equals('Recommendation');
                res.body.pinwall[3].label.should.equals('Book');
                res.body.pinwall[3].pageId.should.equals('6');
                res.body.pinwall[3].name.should.equals('user Meier2');
                res.body.pinwall[3].userId.should.equals('2');
                res.body.pinwall[3].title.should.equals('page6Title');
                res.body.pinwall[3].created.should.equals(504);
                res.body.pinwall[3].previewUrl.should.equals('pages/6/pagePreview.jpg');
                res.body.pinwall[3].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[3].description.should.equals('page6Description');
                res.body.pinwall[3].recommendedByUser.should.equals(false);
                res.body.pinwall[3].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[3].totalNumberOfRecommendations.should.equals(1);
                res.body.pinwall[3].topic.length.should.equals(2);
                res.body.pinwall[3].topic[0].should.equals('health');
                res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[4].pinwallType.should.equals('Recommendation');
                res.body.pinwall[4].label.should.equals('Youtube');
                res.body.pinwall[4].pageId.should.equals('8');
                res.body.pinwall[4].name.should.equals('user Meier2');
                res.body.pinwall[4].userId.should.equals('2');
                res.body.pinwall[4].title.should.equals('page8Title');
                res.body.pinwall[4].created.should.equals(503);
                res.body.pinwall[4].description.should.equals('page8Description');
                res.body.pinwall[4].recommendedByUser.should.equals(false);
                res.body.pinwall[4].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[4].totalNumberOfRecommendations.should.equals(1);
                res.body.pinwall[4].topic.length.should.equals(2);
                res.body.pinwall[4].topic[0].should.equals('socialDevelopment');
                res.body.pinwall[4].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[5].pinwallType.should.equals('Recommendation');
                res.body.pinwall[5].label.should.equals('Link');
                res.body.pinwall[5].pageId.should.equals('9');
                res.body.pinwall[5].name.should.equals('user Meier2');
                res.body.pinwall[5].link.should.equals('www.host.com/test');
                res.body.pinwall[5].hostname.should.equals('www.host.com');
                res.body.pinwall[5].userId.should.equals('2');
                res.body.pinwall[5].title.should.equals('page9Title');
                res.body.pinwall[5].created.should.equals(502);
                res.body.pinwall[5].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[5].previewUrl.should.equals('pages/9/preview.jpg');
                res.body.pinwall[5].heightPreviewImage.should.equals(200);
                res.body.pinwall[5].description.should.equals('page9Description');
                res.body.pinwall[5].recommendedByUser.should.equals(true);
                res.body.pinwall[5].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[5].userRecommendationId.should.equals('6');
                res.body.pinwall[5].totalNumberOfRecommendations.should.equals(2);
                res.body.pinwall[5].topic.length.should.equals(2);
                res.body.pinwall[5].topic[0].should.equals('socialDevelopment');
                res.body.pinwall[5].topic[1].should.equals('personalDevelopment');
            });
        });
    });

    it('Privacy setting for this group allows only to show public blogs (profile:true) - Return a 200', function () {

        dbDsl.createPrivacy(['2'], 'Freund2', {profile: true, image: true, profileData: true, contacts: true, pinwall: false});
        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('2', '1', 'Freund2', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(1);
                res.body.pinwall[0].pinwallType.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('2');
            });
        });
    });

    it('Privacy setting for profile allows only to show public blogs (profile:false) - Return a 200', function () {

        dbDsl.createPrivacy(['2'], 'Freund2', {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('2', '1', 'Freund2', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(1);
                res.body.pinwall[0].pinwallType.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('2');
            });
        });
    });

    it('Privacy setting when allows only to show public blogs (not contact, profile:true) - Return a 200', function () {

        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: false});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(1);
                res.body.pinwall[0].pinwallType.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('2');
            });
        });
    });

    it('Privacy setting for allows only to show public blogs (not contact, profile:false) - Return a 200', function () {

        dbDsl.createPrivacyNoContact(['2'], {profile: false, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(1);
                res.body.pinwall[0].pinwallType.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('2');
            });
        });
    });

    it('Same user Id as for user is invalid - Return a 400', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '1', maxItems: 30, skip: 0}, agent);
            }).then(function (res) {
                res.status.should.equal(400);
            });
        });
    });
})
;
