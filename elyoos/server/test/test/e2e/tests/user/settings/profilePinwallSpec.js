'use strict';

let libUser = require('elyoos-server-lib').user();
let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Integration Tests for getting the pinwall of the user', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        libUser.removeFromCache('userchange@irgendwo.ch');

        return dbDsl.init(2).then(function () {
            let startTime = Math.floor(moment.utc().valueOf() / 1000);
            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: false, pinwall: true});
            dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: false, image: false, profileData: false, contacts: false, pinwall: false});

            dbDsl.createContactConnection('1', '2', 'Freund', startTime - 86401);

            dbDsl.createBlog('1', {blogWriterUserId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], visible: ['Freund'], created: 507});
            dbDsl.createBlog('2', {blogWriterUserId: '1', language: ['de'], topic: ['health'], created: 506, pictureHeight: 400});
            dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 507});
            dbDsl.createBlog('4', {blogWriterUserId: '2', language: ['de'], topic: ['health'], created: 508, pictureHeight: 200});

            dbDsl.createBookPage('5', {language: ['de'], topic: ['health', 'personalDevelopment'], modified: 510, author: 'Hans Muster', publishDate: 1000});
            dbDsl.createBookPage('6', {language: ['de'], topic: ['health', 'personalDevelopment'], modified: 511, author: 'Hans Muster', publishDate: 1000});
            dbDsl.createYoutubePage('7', {
                language: ['de'], topic: ['health', 'personalDevelopment'], modified: 512, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
            dbDsl.createYoutubePage('8', {
                language: ['de'], topic: ['health', 'personalDevelopment'], modified: 513, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });

            dbDsl.crateRecommendationsForBlog('4', [{userId: '1', created: 502}]);

            dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 505}]);
            dbDsl.crateRecommendationsForPage('6', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('7', [{userId: '1', created: 504}]);
            dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 503}]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the pinwall of the user - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/user/settings/profile/pinwall', {maxItems: 30, skip: 0}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(5);

            res.body.pinwall[0].pinwallType.should.equals('Blog');
            res.body.pinwall[0].pageId.should.equals('1');
            res.body.pinwall[0].name.should.equals('user Meier');
            res.body.pinwall[0].userId.should.equals('1');
            res.body.pinwall[0].title.should.equals('blog1Title');
            res.body.pinwall[0].created.should.equals(507);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            should.not.exist(res.body.pinwall[0].url);
            res.body.pinwall[0].text.should.equals('blog1Text');
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].isAdmin.should.equals(true);
            res.body.pinwall[0].isPublic.should.equals(false);
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].pinwallType.should.equals('Blog');
            res.body.pinwall[1].pageId.should.equals('2');
            res.body.pinwall[1].name.should.equals('user Meier');
            res.body.pinwall[1].userId.should.equals('1');
            res.body.pinwall[1].title.should.equals('blog2Title');
            res.body.pinwall[1].created.should.equals(506);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[1].url.should.equals('blog/2/preview.jpg');
            res.body.pinwall[1].text.should.equals('blog2Text');
            res.body.pinwall[1].recommendedByUser.should.equals(false);
            res.body.pinwall[1].isAdmin.should.equals(true);
            res.body.pinwall[1].isPublic.should.equals(true);
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[1].topic.length.should.equals(1);
            res.body.pinwall[1].topic[0].should.equals('health');

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals('Book');
            res.body.pinwall[2].pageId.should.equals('5');
            res.body.pinwall[2].name.should.equals('user Meier');
            res.body.pinwall[2].userId.should.equals('1');
            res.body.pinwall[2].title.should.equals('page5Title');
            res.body.pinwall[2].created.should.equals(505);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[2].description.should.equals('page5Description');
            res.body.pinwall[2].recommendedByUser.should.equals(true);
            res.body.pinwall[2].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[2].userRecommendationId.should.equals('1');
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals('Youtube');
            res.body.pinwall[3].pageId.should.equals('7');
            res.body.pinwall[3].name.should.equals('user Meier');
            res.body.pinwall[3].userId.should.equals('1');
            res.body.pinwall[3].title.should.equals('page7Title');
            res.body.pinwall[3].created.should.equals(504);
            res.body.pinwall[3].description.should.equals('page7Description');
            res.body.pinwall[3].recommendedByUser.should.equals(true);
            res.body.pinwall[3].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[3].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[3].userRecommendationId.should.equals('3');
            res.body.pinwall[3].topic.length.should.equals(2);
            res.body.pinwall[3].topic[0].should.equals('health');
            res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[4].pinwallType.should.equals('Recommendation');
            res.body.pinwall[4].label.should.equals('Blog');
            res.body.pinwall[4].pageId.should.equals('4');
            res.body.pinwall[4].writerName.should.equals('user Meier2');
            res.body.pinwall[4].writerUserId.should.equals('2');
            res.body.pinwall[4].name.should.equals('user Meier');
            res.body.pinwall[4].userId.should.equals('1');
            res.body.pinwall[4].recommendedByUser.should.equals(true);
            res.body.pinwall[4].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[4].userRecommendationId.should.equals('0');
            res.body.pinwall[4].created.should.equals(502);
            res.body.pinwall[4].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[4].heightPreviewImage.should.equals(200);
            res.body.pinwall[4].url.should.equals('blog/4/preview.jpg');
            res.body.pinwall[4].text.should.equals('blog4Text');
            res.body.pinwall[4].isAdmin.should.equals(false);
            res.body.pinwall[4].topic.length.should.equals(1);
            res.body.pinwall[4].topic[0].should.equals('health');
            res.body.pinwall[4].totalNumberOfRecommendations.should.equals(1);
        });
    });

    it('Getting the pinwall of the user with skip and maxItems - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/user/settings/profile/pinwall', {maxItems: 2, skip: 1}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(2);

            res.body.pinwall[0].pinwallType.should.equals('Blog');
            res.body.pinwall[0].pageId.should.equals('2');
            res.body.pinwall[0].name.should.equals('user Meier');
            res.body.pinwall[0].userId.should.equals('1');
            res.body.pinwall[0].title.should.equals('blog2Title');
            res.body.pinwall[0].created.should.equals(506);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[0].url.should.equals('blog/2/preview.jpg');
            res.body.pinwall[0].text.should.equals('blog2Text');
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].isAdmin.should.equals(true);
            res.body.pinwall[0].isPublic.should.equals(true);
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[0].topic.length.should.equals(1);
            res.body.pinwall[0].topic[0].should.equals('health');

            res.body.pinwall[1].pinwallType.should.equals('Recommendation');
            res.body.pinwall[1].label.should.equals('Book');
            res.body.pinwall[1].pageId.should.equals('5');
            res.body.pinwall[1].name.should.equals('user Meier');
            res.body.pinwall[1].userId.should.equals('1');
            res.body.pinwall[1].title.should.equals('page5Title');
            res.body.pinwall[1].created.should.equals(505);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[1].description.should.equals('page5Description');
            res.body.pinwall[1].recommendedByUser.should.equals(true);
            res.body.pinwall[1].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[1].userRecommendationId.should.equals('1');
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[1].topic.length.should.equals(2);
            res.body.pinwall[1].topic[0].should.equals('health');
            res.body.pinwall[1].topic[1].should.equals('personalDevelopment');
        });
    });
});
