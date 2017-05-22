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

        return dbDsl.init(5).then(function () {
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
            dbDsl.createLinkPage('9', {adminId: '2', language: ['de'], topic: ['health'], created: 504, link: 'www.host.com/test', heightPreviewImage: 250});
            dbDsl.createLinkPage('10', {adminId: '1', language: ['de'], topic: ['personalDevelopment'], created: 430, link: 'www.host.com/test', heightPreviewImage: 260});

            dbDsl.createGenericPage('11', {adminId: '2', language: ['de'], topic: ['personalDevelopment'], created: 480}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);
            dbDsl.createGenericPage('12', {adminId: '1', language: ['de'], topic: ['personalDevelopment'], created: 420}, [{
                description: 'Zuerich2',
                lat: 47.37688,
                lng: 8.54169
            }]);

            dbDsl.crateRecommendationsForBlog('4', [{userId: '1', created: 502}, {userId: '2', created: 506}, {userId: '3', created: 507}]);

            dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 505}, {userId: '2', created: 506}]);
            dbDsl.crateRecommendationsForPage('6', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('7', [{userId: '1', created: 504}]);
            dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 503}]);
            dbDsl.crateRecommendationsForPage('9', [{userId: '1', created: 499}, {userId: '2', created: 521}]);
            dbDsl.crateRecommendationsForPage('10', [{userId: '2', created: 520}, {userId: '3', created: 522}, {userId: '4', created: 523}]);
            dbDsl.crateRecommendationsForPage('11', [{userId: '1', created: 498}, ]);
            dbDsl.crateRecommendationsForPage('12', [{userId: '2', created: 521}, {userId: '3', created: 523}, ]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting recommendations of the user - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/settings/profile/pinwall',
                {maxItems: 30, skip: 0, type: 'recommendation'});
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(5);

            res.body.pinwall[0].label.should.equals('Book');
            res.body.pinwall[0].pageId.should.equals('5');
            res.body.pinwall[0].title.should.equals('page5Title');
            res.body.pinwall[0].description.should.equals('page5Description');
            res.body.pinwall[0].previewUrl.should.equals('pages/5/pagePreview.jpg');
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
            res.body.pinwall[1].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
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
            res.body.pinwall[2].previewUrl.should.equals('blog/4/preview.jpg');
            res.body.pinwall[2].title.should.equals('blog4Title');
            res.body.pinwall[2].text.should.equals('blog4Text');
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(3);
            res.body.pinwall[2].isAdmin.should.equals(false);
            res.body.pinwall[2].topic.length.should.equals(1);
            res.body.pinwall[2].topic[0].should.equals('health');

            res.body.pinwall[3].label.should.equals('Link');
            res.body.pinwall[3].pageId.should.equals('9');
            res.body.pinwall[3].recommendedByUser.should.equals(true);
            res.body.pinwall[3].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[3].userRecommendationId.should.equals('8');
            res.body.pinwall[3].created.should.equals(499);
            res.body.pinwall[3].heightPreviewImage.should.equals(250);
            res.body.pinwall[3].previewUrl.should.equals('pages/9/preview.jpg');
            res.body.pinwall[3].title.should.equals('page9Title');
            res.body.pinwall[3].description.should.equals('page9Description');
            res.body.pinwall[3].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[3].isAdmin.should.equals(false);
            res.body.pinwall[3].topic.length.should.equals(1);
            res.body.pinwall[3].topic[0].should.equals('health');

            res.body.pinwall[4].label.should.equals('Generic');
            res.body.pinwall[4].pageId.should.equals('11');
            res.body.pinwall[4].recommendedByUser.should.equals(true);
            res.body.pinwall[4].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[4].userRecommendationId.should.equals('13');
            res.body.pinwall[4].created.should.equals(498);
            res.body.pinwall[4].previewUrl.should.equals('pages/11/preview.jpg');
            res.body.pinwall[4].title.should.equals('generic11Title');
            res.body.pinwall[4].description.should.equals('page11Description');
            res.body.pinwall[4].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[4].isAdmin.should.equals(false);
            res.body.pinwall[4].topic.length.should.equals(1);
            res.body.pinwall[4].topic[0].should.equals('personalDevelopment');
        });
    });

    it('Getting most popular pages where user is admin - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/settings/profile/pinwall',
                {maxItems: 30, skip: 0, type: 'adminPopular'});
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(5);

            res.body.pinwall[0].label.should.equals('Link');
            res.body.pinwall[0].pageId.should.equals('10');
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].created.should.equals(430);
            res.body.pinwall[0].previewUrl.should.equals('pages/10/preview.jpg');
            res.body.pinwall[0].title.should.equals('page10Title');
            res.body.pinwall[0].description.should.equals('page10Description');
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(3);
            res.body.pinwall[0].isAdmin.should.equals(true);
            res.body.pinwall[0].topic.length.should.equals(1);
            res.body.pinwall[0].topic[0].should.equals('personalDevelopment');

            res.body.pinwall[1].label.should.equals('Generic');
            res.body.pinwall[1].pageId.should.equals('12');
            res.body.pinwall[1].recommendedByUser.should.equals(false);
            res.body.pinwall[1].created.should.equals(420);
            res.body.pinwall[1].previewUrl.should.equals('pages/12/preview.jpg');
            res.body.pinwall[1].title.should.equals('generic12Title');
            res.body.pinwall[1].description.should.equals('page12Description');
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[1].isAdmin.should.equals(true);
            res.body.pinwall[1].topic.length.should.equals(1);
            res.body.pinwall[1].topic[0].should.equals('personalDevelopment');

            res.body.pinwall[2].label.should.equals('Youtube');
            res.body.pinwall[2].pageId.should.equals('7');
            res.body.pinwall[2].title.should.equals('page7Title');
            res.body.pinwall[2].description.should.equals('page7Description');
            res.body.pinwall[2].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
            res.body.pinwall[2].created.should.equals(512);
            res.body.pinwall[2].recommendedByUser.should.equals(true);
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[2].userRecommendationId.should.equals('6');
            res.body.pinwall[2].isAdmin.should.equals(true);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[3].label.should.equals('Book');
            res.body.pinwall[3].pageId.should.equals('6');
            res.body.pinwall[3].title.should.equals('page6Title');
            res.body.pinwall[3].description.should.equals('page6Description');
            res.body.pinwall[3].previewUrl.should.equals('pages/6/pagePreview.jpg');
            res.body.pinwall[3].created.should.equals(511);
            res.body.pinwall[3].recommendedByUser.should.equals(false);
            res.body.pinwall[3].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[3].isAdmin.should.equals(true);
            res.body.pinwall[3].topic.length.should.equals(2);
            res.body.pinwall[3].topic[0].should.equals('health');
            res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[4].label.should.equals('Blog');
            res.body.pinwall[4].pageId.should.equals('1');
            res.body.pinwall[4].recommendedByUser.should.equals(false);
            res.body.pinwall[4].created.should.equals(450);
            res.body.pinwall[4].previewUrl.should.equals('blog/1/preview.jpg');
            res.body.pinwall[4].title.should.equals('blog1Title');
            res.body.pinwall[4].text.should.equals('blog1Text');
            res.body.pinwall[4].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[4].isAdmin.should.equals(true);
            res.body.pinwall[4].topic.length.should.equals(2);
            res.body.pinwall[4].topic[0].should.equals('health');
            res.body.pinwall[4].topic[1].should.equals('personalDevelopment');
        });
    });

    it('Getting newest pages where user is admin - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.get('/api/user/settings/profile/pinwall',
                {maxItems: 30, skip: 0, type: 'adminNewest'});
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(5);

            res.body.pinwall[0].label.should.equals('Youtube');
            res.body.pinwall[0].pageId.should.equals('7');
            res.body.pinwall[0].title.should.equals('page7Title');
            res.body.pinwall[0].description.should.equals('page7Description');
            res.body.pinwall[0].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
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
            res.body.pinwall[1].previewUrl.should.equals('pages/6/pagePreview.jpg');
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
            res.body.pinwall[2].previewUrl.should.equals('blog/1/preview.jpg');
            res.body.pinwall[2].title.should.equals('blog1Title');
            res.body.pinwall[2].text.should.equals('blog1Text');
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[2].isAdmin.should.equals(true);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[3].label.should.equals('Link');
            res.body.pinwall[3].pageId.should.equals('10');
            res.body.pinwall[3].recommendedByUser.should.equals(false);
            res.body.pinwall[3].created.should.equals(430);
            res.body.pinwall[3].previewUrl.should.equals('pages/10/preview.jpg');
            res.body.pinwall[3].title.should.equals('page10Title');
            res.body.pinwall[3].description.should.equals('page10Description');
            res.body.pinwall[3].totalNumberOfRecommendations.should.equals(3);
            res.body.pinwall[3].isAdmin.should.equals(true);
            res.body.pinwall[3].topic.length.should.equals(1);
            res.body.pinwall[3].topic[0].should.equals('personalDevelopment');

            res.body.pinwall[4].label.should.equals('Generic');
            res.body.pinwall[4].pageId.should.equals('12');
            res.body.pinwall[4].recommendedByUser.should.equals(false);
            res.body.pinwall[4].created.should.equals(420);
            res.body.pinwall[4].previewUrl.should.equals('pages/12/preview.jpg');
            res.body.pinwall[4].title.should.equals('generic12Title');
            res.body.pinwall[4].description.should.equals('page12Description');
            res.body.pinwall[4].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[4].isAdmin.should.equals(true);
            res.body.pinwall[4].topic.length.should.equals(1);
            res.body.pinwall[4].topic[0].should.equals('personalDevelopment');
        });
    });
});
