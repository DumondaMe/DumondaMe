'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting most popular pages on home screen', function () {

    beforeEach(function () {
        return dbDsl.init(9).then(function () {
            dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

            dbDsl.createBookPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
            dbDsl.createLinkPage('2', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 502, link: 'www.host.com/test', heightPreviewImage: 200});
            dbDsl.createYoutubePage('1', {
                adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 503, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
            dbDsl.createBlog('3', {
                blogWriterUserId: '4',
                language: ['en'],
                topic: ['health', 'personalDevelopment'],
                created: 504,
                pictureHeight: 400
            });
            dbDsl.createBlog('4', {blogWriterUserId: '6', language: ['en'], topic: ['health'], created: 511, pictureHeight: 400});
            dbDsl.createGenericPage('5', {adminId: '2', language: ['de'], topic: ['health', 'personalDevelopment'], created: 506}, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694
            }]);

            dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 510}, {userId: '2', created: 511}, {userId: '3', created: 512}, {userId: '4', created: 513}, {userId: '6', created: 514}]);
            dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 510}, {userId: '2', created: 511}, {userId: '3', created: 512}]);
            dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 510}, {userId: '2', created: 518}]);
            dbDsl.crateRecommendationsForPage('0', [{userId: '1', created: 520}]);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting most popular pages', function () {

        dbDsl.crateRecommendationsForPage('4', [{userId: '1', created: 510}, {userId: '2', created: 511}, {userId: '3', created: 512}, {userId: '4', created: 513}]);
        dbDsl.createContactConnection('1', '3');
        dbDsl.createContactConnection('1', '4');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'popular'
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(6);

            res.body.pinwall[0].pinwallType.should.equals('Recommendation');
            res.body.pinwall[0].label.should.equals('Generic');
            res.body.pinwall[0].pageId.should.equals('5');
            res.body.pinwall[0].name.should.equals('user Meier2');
            res.body.pinwall[0].forename.should.equals('user');
            res.body.pinwall[0].userId.should.equals('2');
            res.body.pinwall[0].title.should.equals('generic5Title');
            res.body.pinwall[0].created.should.equals(506);
            res.body.pinwall[0].previewUrl.should.equals('pages/5/preview.jpg');
            res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[0].description.should.equals('page5Description');
            res.body.pinwall[0].recommendedByUser.should.equals(true);
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(5);
            res.body.pinwall[0].numberOfContactRecommendations.should.equals(2);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].pinwallType.should.equals('Blog');
            res.body.pinwall[1].pageId.should.equals('4');
            res.body.pinwall[1].name.should.equals('user Meier6');
            res.body.pinwall[1].forename.should.equals('user');
            res.body.pinwall[1].userId.should.equals('6');
            res.body.pinwall[1].title.should.equals('blog4Title');
            res.body.pinwall[1].created.should.equals(511);
            res.body.pinwall[1].previewUrl.should.equals('blog/4/preview.jpg');
            res.body.pinwall[1].profileUrl.should.equals('profileImage/6/thumbnail.jpg');
            res.body.pinwall[1].text.should.equals('blog4Text');
            res.body.pinwall[1].recommendedByUser.should.equals(true);
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(4);
            res.body.pinwall[1].numberOfContactRecommendations.should.equals(2);
            res.body.pinwall[1].topic.length.should.equals(1);
            res.body.pinwall[1].topic[0].should.equals('health');

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals('Link');
            res.body.pinwall[2].pageId.should.equals('2');
            res.body.pinwall[2].name.should.equals('user Meier3');
            res.body.pinwall[2].forename.should.equals('user');
            res.body.pinwall[2].link.should.equals('www.host.com/test');
            res.body.pinwall[2].hostname.should.equals('www.host.com');
            res.body.pinwall[2].userId.should.equals('3');
            res.body.pinwall[2].title.should.equals('page2Title');
            res.body.pinwall[2].created.should.equals(502);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
            res.body.pinwall[2].previewUrl.should.equals('pages/2/preview.jpg');
            res.body.pinwall[2].heightPreviewImage.should.equals(200);
            res.body.pinwall[2].description.should.equals('page2Description');
            res.body.pinwall[2].recommendedByUser.should.equals(true);
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(3);
            res.body.pinwall[2].numberOfContactRecommendations.should.equals(1);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals('Youtube');
            res.body.pinwall[3].link.should.equals('https://www.youtube.com/watch?v=hTarMdJub0M');
            res.body.pinwall[3].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
            res.body.pinwall[3].pageId.should.equals('1');
            res.body.pinwall[3].name.should.equals('user Meier2');
            res.body.pinwall[3].forename.should.equals('user');
            res.body.pinwall[3].userId.should.equals('2');
            res.body.pinwall[3].title.should.equals('page1Title');
            res.body.pinwall[3].created.should.equals(503);
            res.body.pinwall[3].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[3].description.should.equals('page1Description');
            res.body.pinwall[3].recommendedByUser.should.equals(true);
            res.body.pinwall[3].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[3].numberOfContactRecommendations.should.equals(0);
            res.body.pinwall[3].topic.length.should.equals(2);
            res.body.pinwall[3].topic[0].should.equals('health');
            res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[4].pinwallType.should.equals('Recommendation');
            res.body.pinwall[4].label.should.equals('Book');
            res.body.pinwall[4].pageId.should.equals('0');
            res.body.pinwall[4].name.should.equals('user Meier');
            res.body.pinwall[4].forename.should.equals('user');
            res.body.pinwall[4].userId.should.equals('1');
            res.body.pinwall[4].title.should.equals('page0Title');
            res.body.pinwall[4].created.should.equals(501);
            res.body.pinwall[4].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[4].previewUrl.should.equals('pages/0/pagePreview.jpg');
            res.body.pinwall[4].description.should.equals('page0Description');
            res.body.pinwall[4].recommendedByUser.should.equals(true);
            res.body.pinwall[4].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[4].numberOfContactRecommendations.should.equals(0);
            res.body.pinwall[4].userRecommendationId.should.equals('10');
            res.body.pinwall[4].topic.length.should.equals(2);
            res.body.pinwall[4].topic[0].should.equals('health');
            res.body.pinwall[4].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[5].pinwallType.should.equals('Blog');
            res.body.pinwall[5].pageId.should.equals('3');
            res.body.pinwall[5].name.should.equals('user Meier4');
            res.body.pinwall[5].forename.should.equals('user');
            res.body.pinwall[5].userId.should.equals('4');
            res.body.pinwall[5].title.should.equals('blog3Title');
            res.body.pinwall[5].created.should.equals(504);
            res.body.pinwall[5].previewUrl.should.equals('blog/3/preview.jpg');
            res.body.pinwall[5].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
            res.body.pinwall[5].text.should.equals('blog3Text');
            res.body.pinwall[5].recommendedByUser.should.equals(false);
            res.body.pinwall[5].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[5].numberOfContactRecommendations.should.equals(0);
            res.body.pinwall[5].topic.length.should.equals(2);
            res.body.pinwall[5].topic[0].should.equals('health');
            res.body.pinwall[5].topic[1].should.equals('personalDevelopment');
        });
    });

    it('Getting most popular recommendations of contacts only', function () {

        dbDsl.createPrivacy(['1'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        
        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createContactConnection('1', '3', 'Freund', 500);
        dbDsl.createContactConnection('1', '4', 'Freund', 500);

        dbDsl.crateRecommendationsForPage('1', [{userId: '6', created: 510}, {userId: '7', created: 518}, {userId: '8', created: 518},{userId: '9', created: 518}]);
        
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'popular'
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(3);

            res.body.pinwall[0].pinwallType.should.equals('Recommendation');
            res.body.pinwall[0].label.should.equals('Generic');
            res.body.pinwall[0].pageId.should.equals('5');
            res.body.pinwall[0].name.should.equals('user Meier2');
            res.body.pinwall[0].forename.should.equals('user');
            res.body.pinwall[0].userId.should.equals('2');
            res.body.pinwall[0].title.should.equals('generic5Title');
            res.body.pinwall[0].created.should.equals(506);
            res.body.pinwall[0].previewUrl.should.equals('pages/5/preview.jpg');
            res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[0].description.should.equals('page5Description');
            res.body.pinwall[0].recommendedByUser.should.equals(true);
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(5);
            res.body.pinwall[0].numberOfContactRecommendations.should.equals(3);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].pinwallType.should.equals('Recommendation');
            res.body.pinwall[1].label.should.equals('Link');
            res.body.pinwall[1].pageId.should.equals('2');
            res.body.pinwall[1].name.should.equals('user Meier3');
            res.body.pinwall[1].forename.should.equals('user');
            res.body.pinwall[1].link.should.equals('www.host.com/test');
            res.body.pinwall[1].hostname.should.equals('www.host.com');
            res.body.pinwall[1].userId.should.equals('3');
            res.body.pinwall[1].title.should.equals('page2Title');
            res.body.pinwall[1].created.should.equals(502);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
            res.body.pinwall[1].previewUrl.should.equals('pages/2/preview.jpg');
            res.body.pinwall[1].heightPreviewImage.should.equals(200);
            res.body.pinwall[1].description.should.equals('page2Description');
            res.body.pinwall[1].recommendedByUser.should.equals(true);
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(3);
            res.body.pinwall[1].numberOfContactRecommendations.should.equals(2);
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
            res.body.pinwall[2].title.should.equals('page1Title');
            res.body.pinwall[2].created.should.equals(503);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[2].description.should.equals('page1Description');
            res.body.pinwall[2].recommendedByUser.should.equals(true);
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(6);
            res.body.pinwall[2].numberOfContactRecommendations.should.equals(1);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');
        });
    });
});
