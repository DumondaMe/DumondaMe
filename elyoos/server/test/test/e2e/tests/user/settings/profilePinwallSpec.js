'use strict';

let libUser = require('elyoos-server-lib').user();
let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let dbDsl = require('elyoos-server-test-util').dbDSL;

describe('Integration Tests for getting the pinwall of the user', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        libUser.removeFromCache('userchange@irgendwo.ch');

        return dbDsl.init(3).then(function () {
            let startTime = Math.floor(moment.utc().valueOf() / 1000);
            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: false, pinwall: true});
            dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: false, image: false, profileData: false, contacts: false, pinwall: false});

            dbDsl.createContactConnection('1', '2', 'Freund', startTime - 86401);

            dbDsl.createBlog('1', {blogWriterUserId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], visible: ['Freund'], created: 450, pictureHeight: 400});
            dbDsl.createBlog('2', {blogWriterUserId: '2', language: ['de'], topic: ['health'], created: 506, pictureHeight: 400});
            dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 507});
            dbDsl.createBlog('4', {blogWriterUserId: '2', language: ['de'], topic: ['health'], created: 508, pictureHeight: 200});

            dbDsl.createBookPage('5', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 510, author: 'Hans Muster', publishDate: 1000});
            dbDsl.createBookPage('6', {adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 511, author: 'Hans Muster', publishDate: 1000});
            dbDsl.createYoutubePage('7', {
                adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 512, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
            dbDsl.createYoutubePage('8', {
                adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 513, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });

            dbDsl.crateRecommendationsForBlog('4', [{userId: '1', created: 502}, {userId: '2', created: 506}, {userId: '3', created: 507}]);

            dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 505}, {userId: '2', created: 506}]);
            dbDsl.crateRecommendationsForPage('6', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('7', [{userId: '1', created: 504}]);
            dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 503}]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting recommendations of the user - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/user/settings/profile/pinwall',
                {maxItems: 30, skip: 0, type: 'recommendation'}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(3);

            res.body.pinwall[0].label.should.equals('Book');
            res.body.pinwall[0].pageId.should.equals('5');
            res.body.pinwall[0].title.should.equals('page5Title');
            res.body.pinwall[0].description.should.equals('page5Description');
            res.body.pinwall[0].created.should.equals(505);
            res.body.pinwall[0].recommendedByUser.should.equals(true);
            res.body.pinwall[0].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[0].userRecommendationId.should.equals('3');
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[0].isAdmin.should.equals(false);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].label.should.equals('Youtube');
            res.body.pinwall[1].pageId.should.equals('7');
            res.body.pinwall[1].title.should.equals('page7Title');
            res.body.pinwall[1].description.should.equals('page7Description');
            res.body.pinwall[1].created.should.equals(504);
            res.body.pinwall[1].recommendedByUser.should.equals(true);
            res.body.pinwall[1].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[1].userRecommendationId.should.equals('6');
            res.body.pinwall[1].isAdmin.should.equals(true);
            res.body.pinwall[1].topic.length.should.equals(2);
            res.body.pinwall[1].topic[0].should.equals('health');
            res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[2].label.should.equals('Blog');
            res.body.pinwall[2].pageId.should.equals('4');
            res.body.pinwall[2].writerName.should.equals('user Meier2');
            res.body.pinwall[2].writerUserId.should.equals('2');
            res.body.pinwall[2].recommendedByUser.should.equals(true);
            res.body.pinwall[2].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[2].userRecommendationId.should.equals('0');
            res.body.pinwall[2].created.should.equals(502);
            res.body.pinwall[2].heightPreviewImage.should.equals(200);
            res.body.pinwall[2].url.should.equals('blog/4/preview.jpg');
            res.body.pinwall[2].title.should.equals('blog4Title');
            res.body.pinwall[2].text.should.equals('blog4Text');
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(3);
            res.body.pinwall[2].isAdmin.should.equals(false);
            res.body.pinwall[2].topic.length.should.equals(1);
            res.body.pinwall[2].topic[0].should.equals('health');
        });
    });

    it('Getting pages where user is admin - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/user/settings/profile/pinwall',
                {maxItems: 30, skip: 0, type: 'admin'}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(3);

            res.body.pinwall[0].label.should.equals('Youtube');
            res.body.pinwall[0].pageId.should.equals('7');
            res.body.pinwall[0].title.should.equals('page7Title');
            res.body.pinwall[0].description.should.equals('page7Description');
            res.body.pinwall[0].created.should.equals(512);
            res.body.pinwall[0].recommendedByUser.should.equals(true);
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[0].userRecommendationId.should.equals('6');
            res.body.pinwall[0].isAdmin.should.equals(true);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].label.should.equals('Book');
            res.body.pinwall[1].pageId.should.equals('6');
            res.body.pinwall[1].title.should.equals('page6Title');
            res.body.pinwall[1].description.should.equals('page6Description');
            res.body.pinwall[1].created.should.equals(511);
            res.body.pinwall[1].recommendedByUser.should.equals(false);
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[1].isAdmin.should.equals(true);
            res.body.pinwall[1].topic.length.should.equals(2);
            res.body.pinwall[1].topic[0].should.equals('health');
            res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[2].label.should.equals('Blog');
            res.body.pinwall[2].pageId.should.equals('1');
            res.body.pinwall[2].recommendedByUser.should.equals(false);
            res.body.pinwall[2].created.should.equals(450);
            res.body.pinwall[2].url.should.equals('blog/1/preview.jpg');
            res.body.pinwall[2].title.should.equals('blog1Title');
            res.body.pinwall[2].text.should.equals('blog1Text');
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[2].isAdmin.should.equals(true);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');
        });
    });
});
