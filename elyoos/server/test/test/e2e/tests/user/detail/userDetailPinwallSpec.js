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

        return dbDsl.init(6).then(function () {
            let startTime = Math.floor(moment.utc().valueOf() / 1000);
            dbDsl.createPrivacyNoContact(['1'], {profile: false, image: false, profileData: false, contacts: false, pinwall: false});
            dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: false, pinwall: true});

            dbDsl.createContactConnection('1', '2', 'Freund', startTime - 86401);

            dbDsl.createBlog('1', {blogWriterUserId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], visible: ['Freund'], created: 506});
            dbDsl.createBlog('2', {blogWriterUserId: '2', language: ['de'], topic: ['health', 'spiritual'], created: 520, pictureHeight: 400});
            dbDsl.createBlog('3', {blogWriterUserId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 507, visible: ['Freund']});
            dbDsl.createBlog('4', {blogWriterUserId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 502, pictureHeight: 200});

            dbDsl.createBookPage('5', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 515, author: 'Hans Muster', publishDate: 1000});
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

            dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 505}, {userId: '3', created: 502},]);
            dbDsl.crateRecommendationsForPage('6', [{userId: '2', created: 504}]);
            dbDsl.crateRecommendationsForPage('7', [{userId: '1', created: 504}]);
            dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 503}, {userId: '3', created: 502}, {userId: '4', created: 502}]);
            dbDsl.crateRecommendationsForPage('9', [{userId: '1', created: 501}, {userId: '2', created: 502}, {userId: '3', created: 502}, {userId: '4', created: 502}]);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the most popular pages of the user- Return a 200', function () {

        dbDsl.createPrivacy(['2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['2'], {profile: false, image: true, profileData: true, contacts: false, pinwall: false});
        dbDsl.createContactConnection('2', '1', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'adminPopular'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(5);

                res.body.pinwall[0].label.should.equals('Link');
                res.body.pinwall[0].pageId.should.equals('9');
                res.body.pinwall[0].link.should.equals('www.host.com/test');
                res.body.pinwall[0].hostname.should.equals('www.host.com');
                res.body.pinwall[0].title.should.equals('page9Title');
                res.body.pinwall[0].created.should.equals(514);
                res.body.pinwall[0].previewUrl.should.equals('pages/9/preview.jpg');
                res.body.pinwall[0].description.should.equals('page9Description');
                res.body.pinwall[0].recommendedByUser.should.equals(true);
                res.body.pinwall[0].userRecommendationId.should.equals('9');
                res.body.pinwall[0].totalNumberOfRecommendations.should.equals(4);
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('socialDevelopment');
                res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[1].label.should.equals('Youtube');
                res.body.pinwall[1].pageId.should.equals('8');
                res.body.pinwall[1].title.should.equals('page8Title');
                res.body.pinwall[1].created.should.equals(513);
                res.body.pinwall[1].description.should.equals('page8Description');
                res.body.pinwall[1].recommendedByUser.should.equals(false);
                res.body.pinwall[1].totalNumberOfRecommendations.should.equals(3);
                res.body.pinwall[1].topic.length.should.equals(2);
                res.body.pinwall[1].topic[0].should.equals('socialDevelopment');
                res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[2].label.should.equals('Book');
                res.body.pinwall[2].pageId.should.equals('5');
                res.body.pinwall[2].title.should.equals('page5Title');
                res.body.pinwall[2].created.should.equals(515);
                res.body.pinwall[2].previewUrl.should.equals('pages/5/pagePreview.jpg');
                res.body.pinwall[2].description.should.equals('page5Description');
                res.body.pinwall[2].recommendedByUser.should.equals(true);
                res.body.pinwall[2].totalNumberOfRecommendations.should.equals(2);
                res.body.pinwall[2].topic.length.should.equals(2);
                res.body.pinwall[2].topic[0].should.equals('health');
                res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[3].label.should.equals('Blog');
                res.body.pinwall[3].pageId.should.equals('1');
                res.body.pinwall[3].title.should.equals('blog1Title');
                res.body.pinwall[3].created.should.equals(506);
                should.not.exist(res.body.pinwall[3].previewUrl);
                should.not.exist(res.body.pinwall[3].urlFull);
                res.body.pinwall[3].text.should.equals('blog1Text');
                res.body.pinwall[3].isPublic.should.equals(false);
                res.body.pinwall[3].recommendedByUser.should.equals(true);
                res.body.pinwall[3].userRecommendationId.should.equals('0');
                res.body.pinwall[3].totalNumberOfRecommendations.should.equals(1);
                res.body.pinwall[3].topic.length.should.equals(2);
                res.body.pinwall[3].topic[0].should.equals('health');
                res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[4].label.should.equals('Blog');
                res.body.pinwall[4].pageId.should.equals('2');
                res.body.pinwall[4].title.should.equals('blog2Title');
                res.body.pinwall[4].created.should.equals(520);
                res.body.pinwall[4].previewUrl.should.equals('blog/2/preview.jpg');
                res.body.pinwall[4].text.should.equals('blog2Text');
                res.body.pinwall[4].recommendedByUser.should.equals(false);
                res.body.pinwall[4].totalNumberOfRecommendations.should.equals(0);
                res.body.pinwall[4].isPublic.should.equals(true);
                res.body.pinwall[4].topic.length.should.equals(2);
                res.body.pinwall[4].topic[0].should.equals('health');
                res.body.pinwall[4].topic[1].should.equals('spiritual');
            });
        });
    });

    it('Getting the newest pages of the user- Return a 200', function () {

        dbDsl.createPrivacy(['2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['2'], {profile: false, image: true, profileData: true, contacts: false, pinwall: false});
        dbDsl.createContactConnection('2', '1', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'adminNewest'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(5);

                res.body.pinwall[0].label.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('2');
                res.body.pinwall[0].title.should.equals('blog2Title');
                res.body.pinwall[0].created.should.equals(520);
                res.body.pinwall[0].previewUrl.should.equals('blog/2/preview.jpg');
                res.body.pinwall[0].text.should.equals('blog2Text');
                res.body.pinwall[0].recommendedByUser.should.equals(false);
                res.body.pinwall[0].totalNumberOfRecommendations.should.equals(0);
                res.body.pinwall[0].isPublic.should.equals(true);
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('health');
                res.body.pinwall[0].topic[1].should.equals('spiritual');

                res.body.pinwall[1].label.should.equals('Book');
                res.body.pinwall[1].pageId.should.equals('5');
                res.body.pinwall[1].title.should.equals('page5Title');
                res.body.pinwall[1].created.should.equals(515);
                res.body.pinwall[1].previewUrl.should.equals('pages/5/pagePreview.jpg');
                res.body.pinwall[1].description.should.equals('page5Description');
                res.body.pinwall[1].recommendedByUser.should.equals(true);
                res.body.pinwall[1].totalNumberOfRecommendations.should.equals(2);
                res.body.pinwall[1].topic.length.should.equals(2);
                res.body.pinwall[1].topic[0].should.equals('health');
                res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[2].label.should.equals('Link');
                res.body.pinwall[2].pageId.should.equals('9');
                res.body.pinwall[2].link.should.equals('www.host.com/test');
                res.body.pinwall[2].hostname.should.equals('www.host.com');
                res.body.pinwall[2].title.should.equals('page9Title');
                res.body.pinwall[2].created.should.equals(514);
                res.body.pinwall[2].previewUrl.should.equals('pages/9/preview.jpg');
                res.body.pinwall[2].description.should.equals('page9Description');
                res.body.pinwall[2].recommendedByUser.should.equals(true);
                res.body.pinwall[2].userRecommendationId.should.equals('9');
                res.body.pinwall[2].totalNumberOfRecommendations.should.equals(4);
                res.body.pinwall[2].topic.length.should.equals(2);
                res.body.pinwall[2].topic[0].should.equals('socialDevelopment');
                res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[3].label.should.equals('Youtube');
                res.body.pinwall[3].pageId.should.equals('8');
                res.body.pinwall[3].title.should.equals('page8Title');
                res.body.pinwall[3].created.should.equals(513);
                res.body.pinwall[3].description.should.equals('page8Description');
                res.body.pinwall[3].recommendedByUser.should.equals(false);
                res.body.pinwall[3].totalNumberOfRecommendations.should.equals(3);
                res.body.pinwall[3].topic.length.should.equals(2);
                res.body.pinwall[3].topic[0].should.equals('socialDevelopment');
                res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[4].label.should.equals('Blog');
                res.body.pinwall[4].pageId.should.equals('1');
                res.body.pinwall[4].title.should.equals('blog1Title');
                res.body.pinwall[4].created.should.equals(506);
                should.not.exist(res.body.pinwall[4].previewUrl);
                should.not.exist(res.body.pinwall[4].urlFull);
                res.body.pinwall[4].text.should.equals('blog1Text');
                res.body.pinwall[4].isPublic.should.equals(false);
                res.body.pinwall[4].recommendedByUser.should.equals(true);
                res.body.pinwall[4].userRecommendationId.should.equals('0');
                res.body.pinwall[4].totalNumberOfRecommendations.should.equals(1);
                res.body.pinwall[4].topic.length.should.equals(2);
                res.body.pinwall[4].topic[0].should.equals('health');
                res.body.pinwall[4].topic[1].should.equals('personalDevelopment');
            });
        });
    });

    it('Getting the newest recommendations ot the user- Return a 200', function () {

        dbDsl.createPrivacy(['2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['2'], {profile: false, image: true, profileData: true, contacts: false, pinwall: false});
        dbDsl.createContactConnection('2', '1', 'Freund', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'recommendation'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(4);

                res.body.pinwall[0].label.should.equals('Blog');
                res.body.pinwall[0].pageId.should.equals('4');
                res.body.pinwall[0].writerName.should.equals('user Meier');
                res.body.pinwall[0].writerUserId.should.equals('1');
                res.body.pinwall[0].recommendedByUser.should.equals(false);
                res.body.pinwall[0].created.should.equals(508);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[0].heightPreviewImage.should.equals(200);
                res.body.pinwall[0].previewUrl.should.equals('blog/4/preview.jpg');
                res.body.pinwall[0].urlFull.should.equals('blog/4/normal.jpg');
                res.body.pinwall[0].text.should.equals('blog4Text');
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('health');
                res.body.pinwall[0].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[0].totalNumberOfRecommendations.should.equals(1);

                res.body.pinwall[1].label.should.equals('Book');
                res.body.pinwall[1].pageId.should.equals('6');
                res.body.pinwall[1].title.should.equals('page6Title');
                res.body.pinwall[1].created.should.equals(504);
                res.body.pinwall[1].previewUrl.should.equals('pages/6/pagePreview.jpg');
                res.body.pinwall[1].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[1].description.should.equals('page6Description');
                res.body.pinwall[1].recommendedByUser.should.equals(false);
                res.body.pinwall[1].totalNumberOfRecommendations.should.equals(1);
                res.body.pinwall[1].topic.length.should.equals(2);
                res.body.pinwall[1].topic[0].should.equals('health');
                res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[2].label.should.equals('Youtube');
                res.body.pinwall[2].pageId.should.equals('8');
                res.body.pinwall[2].title.should.equals('page8Title');
                res.body.pinwall[2].created.should.equals(503);
                res.body.pinwall[2].description.should.equals('page8Description');
                res.body.pinwall[2].recommendedByUser.should.equals(false);
                res.body.pinwall[2].totalNumberOfRecommendations.should.equals(3);
                res.body.pinwall[2].topic.length.should.equals(2);
                res.body.pinwall[2].topic[0].should.equals('socialDevelopment');
                res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

                res.body.pinwall[3].label.should.equals('Link');
                res.body.pinwall[3].pageId.should.equals('9');
                res.body.pinwall[3].link.should.equals('www.host.com/test');
                res.body.pinwall[3].hostname.should.equals('www.host.com');
                res.body.pinwall[3].title.should.equals('page9Title');
                res.body.pinwall[3].created.should.equals(502);
                res.body.pinwall[3].previewUrl.should.equals('pages/9/preview.jpg');
                res.body.pinwall[3].description.should.equals('page9Description');
                res.body.pinwall[3].recommendedByUser.should.equals(true);
                res.body.pinwall[3].userRecommendationId.should.equals('9');
                res.body.pinwall[3].totalNumberOfRecommendations.should.equals(4);
                res.body.pinwall[3].topic.length.should.equals(2);
                res.body.pinwall[3].topic[0].should.equals('socialDevelopment');
                res.body.pinwall[3].topic[1].should.equals('personalDevelopment');
            });
        });
    });

    it('Show no blog (is contact, profile:true, pinwall:false, adminPopular) - Return a 200', function () {

        dbDsl.createPrivacy(['2'], 'Freund2', {profile: true, image: true, profileData: true, contacts: true, pinwall: false});
        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('2', '1', 'Freund2', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'adminPopular'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(0);
            });
        });
    });

    it('Show no blog (is contact, profile:true, pinwall:false, recommendation) - Return a 200', function () {

        dbDsl.crateRecommendationsForBlog('3', [{userId: '2', created: 550}]);
        dbDsl.createPrivacy(['2'], 'Freund2', {profile: true, image: true, profileData: true, contacts: true, pinwall: false});
        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('2', '1', 'Freund2', 500);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'recommendation'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(0);
            });
        });
    });

    it('Show no blog (is not contact, profile:true, pinwall:false, adminPopular) - Return a 200', function () {

        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: false});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'adminPopular'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(0);
            });
        });
    });

    it('Show no blog (is not contact, profile:false, pinwall:true, adminPopular) - Return a 200', function () {

        dbDsl.createPrivacyNoContact(['2'], {profile: false, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'adminPopular'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(0);
            });
        });
    });

    it('Show no blog (is not contact, profile:true, pinwall:false, recommendation) - Return a 200', function () {

        dbDsl.crateRecommendationsForBlog('3', [{userId: '2', created: 550}]);
        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: false});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'recommendation'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(0);
            });
        });
    });

    it('Show only public blog (is not contact, profile:false, pinwall:true, recommendation) - Return a 200', function () {

        dbDsl.crateRecommendationsForBlog('3', [{userId: '2', created: 550}]);
        dbDsl.createPrivacyNoContact(['2'], {profile: false, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'recommendation'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(0);
            });
        });
    });

    it('Do not show pinwall when other user has user blocked (recommendation)- Return a 200', function () {

        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.blockUser('2', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'recommendation'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(0);
            });
        });
    });

    it('Do not show pinwall when other user has user blocked (adminPopular)- Return a 200', function () {

        dbDsl.createPrivacyNoContact(['2'], {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.blockUser('2', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0, type: 'adminPopular'}, agent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equal(0);
            });
        });
    });

    it('Same user Id as for user is invalid - Return a 400', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function (agent) {
                return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '1', maxItems: 30, skip: 0, type: 'recommendation'}, agent);
            }).then(function (res) {
                res.status.should.equal(400);
            });
        });
    });
})
;
