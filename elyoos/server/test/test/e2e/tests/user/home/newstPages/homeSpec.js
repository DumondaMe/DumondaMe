'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Integration Tests for getting newest pages on home screen', function () {

    beforeEach(function () {
        return dbDsl.init(6).then(function () {
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting newest pages (show only pages recommended/administrated by contacts)', function () {

        dbDsl.createPrivacyNoContact(['4', '5', '6'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: false, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['3'], {profile: true, image: true, contacts: true, pinwall: false});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true,  contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Bekannter', {profile: true, image: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createContactConnection('1', '3', 'Bekannter', 500);
        dbDsl.createContactConnection('2', '1', 'Freund', 500);
        dbDsl.createContactConnection('2', '3', 'Freund', 500);

        dbDsl.createBookPage('0', {adminId: '2', language: ['de'], topic: ['health'], created: 530, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('1', {adminId: '4', language: ['de'], topic: ['health'], created: 529, author: 'HansMuster2', publishDate: 1000});
        dbDsl.createLinkPage('2', {adminId: '4', language: ['de'], topic: ['health'], created: 528, link: 'www.host.com/test', heightPreviewImage: 200});
        dbDsl.createLinkPage('3', {adminId: '4', language: ['de'], topic: ['health'], created: 527, link: 'www.host.com/test2', heightPreviewImage: 200});
        dbDsl.createYoutubePage('4', {
            adminId: '6', language: ['de'], topic: ['health'], created: 526, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
            linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
        });
        dbDsl.createYoutubePage('5', {
            adminId: '6', language: ['de'], topic: ['health'], created: 525, link: 'https://www.youtube.com/watch?v=hTarMdJub0',
            linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0'
        });
        dbDsl.createBlog('6', {blogWriterUserId: '2', language: ['en'], topic: ['health'], created: 524, visible: ['Freund'], pictureHeight: 400});
        dbDsl.createBlog('7', {blogWriterUserId: '3', language: ['en'], topic: ['health'], created: 523, visible: ['Freund']});
        dbDsl.createBlog('8', {blogWriterUserId: '1', language: ['en'], topic: ['health'], created: 522});
        dbDsl.createBlog('9', {blogWriterUserId: '4', language: ['en'], topic: ['health'], created: 521});

        dbDsl.createGenericPage('10', {adminId: '5', language: ['de'], topic: ['health'], created: 519}, [{
            description: 'Zuerich',
            lat: 47.376887,
            lng: 8.541694
        }]);

        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500}, {userId: '3', created: 504}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 501}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '4', created: 502}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '3', created: 503}]);
        dbDsl.crateRecommendationsForPage('6', [{userId: '3', created: 503}]);
        dbDsl.crateRecommendationsForPage('9', [{userId: '2', created: 504}]);
        dbDsl.crateRecommendationsForPage('10', [{userId: '2', created: 505}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(8);

            res.body.pinwall[0].pinwallType.should.equals('Recommendation');
            res.body.pinwall[0].label.should.equals('Book');
            res.body.pinwall[0].pageId.should.equals('0');
            res.body.pinwall[0].name.should.equals('user Meier2');
            res.body.pinwall[0].forename.should.equals('user');
            res.body.pinwall[0].userId.should.equals('2');
            res.body.pinwall[0].title.should.equals('page0Title');
            res.body.pinwall[0].created.should.equals(530);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[0].previewUrl.should.equals('pages/0/pagePreview.jpg');
            res.body.pinwall[0].description.should.equals('page0Description');
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[0].topic.length.should.equals(1);
            res.body.pinwall[0].topic[0].should.equals('health');

            res.body.pinwall[1].pinwallType.should.equals('Recommendation');
            res.body.pinwall[1].label.should.equals('Book');
            res.body.pinwall[1].pageId.should.equals('1');
            res.body.pinwall[1].name.should.equals('user Meier4');
            res.body.pinwall[1].forename.should.equals('user');
            res.body.pinwall[1].userId.should.equals('4');
            res.body.pinwall[1].title.should.equals('page1Title');
            res.body.pinwall[1].created.should.equals(529);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
            res.body.pinwall[1].previewUrl.should.equals('pages/1/pagePreview.jpg');
            res.body.pinwall[1].description.should.equals('page1Description');
            res.body.pinwall[1].recommendedByUser.should.equals(true);
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[1].topic.length.should.equals(1);
            res.body.pinwall[1].topic[0].should.equals('health');

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals('Link');
            res.body.pinwall[2].pageId.should.equals('2');
            res.body.pinwall[2].name.should.equals('user Meier4');
            res.body.pinwall[2].forename.should.equals('user');
            res.body.pinwall[2].link.should.equals('www.host.com/test');
            res.body.pinwall[2].hostname.should.equals('www.host.com');
            res.body.pinwall[2].userId.should.equals('4');
            res.body.pinwall[2].title.should.equals('page2Title');
            res.body.pinwall[2].created.should.equals(528);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
            res.body.pinwall[2].previewUrl.should.equals('pages/2/preview.jpg');
            res.body.pinwall[2].heightPreviewImage.should.equals(200);
            res.body.pinwall[2].description.should.equals('page2Description');
            res.body.pinwall[2].recommendedByUser.should.equals(false);
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[2].topic.length.should.equals(1);
            res.body.pinwall[2].topic[0].should.equals('health');

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals('Youtube');
            res.body.pinwall[3].link.should.equals('https://www.youtube.com/watch?v=hTarMdJub0');
            res.body.pinwall[3].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0');
            res.body.pinwall[3].pageId.should.equals('5');
            res.body.pinwall[3].name.should.equals('user Meier6');
            res.body.pinwall[3].forename.should.equals('user');
            res.body.pinwall[3].userId.should.equals('6');
            res.body.pinwall[3].title.should.equals('page5Title');
            res.body.pinwall[3].created.should.equals(525);
            res.body.pinwall[3].profileUrl.should.equals('profileImage/6/thumbnail.jpg');
            res.body.pinwall[3].description.should.equals('page5Description');
            res.body.pinwall[3].recommendedByUser.should.equals(false);
            res.body.pinwall[3].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[3].topic.length.should.equals(1);
            res.body.pinwall[3].topic[0].should.equals('health');

            res.body.pinwall[4].pinwallType.should.equals('Blog');
            res.body.pinwall[4].pageId.should.equals('6');
            res.body.pinwall[4].name.should.equals('user Meier2');
            res.body.pinwall[4].forename.should.equals('user');
            res.body.pinwall[4].userId.should.equals('2');
            res.body.pinwall[4].created.should.equals(524);
            res.body.pinwall[4].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            should.exist(res.body.pinwall[4].previewUrl);
            res.body.pinwall[4].title.should.equals('blog6Title');
            res.body.pinwall[4].text.should.equals('blog6Text');
            res.body.pinwall[4].isAdmin.should.equals(false);
            res.body.pinwall[4].isPublic.should.equals(false);
            res.body.pinwall[4].recommendedByUser.should.equals(false);
            res.body.pinwall[4].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[4].topic.length.should.equals(1);
            res.body.pinwall[4].topic[0].should.equals('health');

            res.body.pinwall[5].pinwallType.should.equals('Blog');
            res.body.pinwall[5].pageId.should.equals('8');
            res.body.pinwall[5].name.should.equals('user Meier');
            res.body.pinwall[5].forename.should.equals('user');
            res.body.pinwall[5].userId.should.equals('1');
            res.body.pinwall[5].created.should.equals(522);
            res.body.pinwall[5].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            should.not.exist(res.body.pinwall[5].previewUrl);
            res.body.pinwall[5].title.should.equals('blog8Title');
            res.body.pinwall[5].text.should.equals('blog8Text');
            res.body.pinwall[5].isAdmin.should.equals(true);
            res.body.pinwall[5].isPublic.should.equals(true);
            res.body.pinwall[5].recommendedByUser.should.equals(false);
            res.body.pinwall[5].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[5].topic.length.should.equals(1);
            res.body.pinwall[5].topic[0].should.equals('health');

            res.body.pinwall[6].pinwallType.should.equals('Blog');
            res.body.pinwall[6].pageId.should.equals('9');
            res.body.pinwall[6].name.should.equals('user Meier4');
            res.body.pinwall[6].forename.should.equals('user');
            res.body.pinwall[6].userId.should.equals('4');
            res.body.pinwall[6].created.should.equals(521);
            res.body.pinwall[6].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
            should.not.exist(res.body.pinwall[6].previewUrl);
            res.body.pinwall[6].title.should.equals('blog9Title');
            res.body.pinwall[6].text.should.equals('blog9Text');
            res.body.pinwall[6].isAdmin.should.equals(false);
            res.body.pinwall[6].isPublic.should.equals(true);
            res.body.pinwall[6].recommendedByUser.should.equals(false);
            res.body.pinwall[6].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[6].topic.length.should.equals(1);
            res.body.pinwall[6].topic[0].should.equals('health');

            res.body.pinwall[7].pinwallType.should.equals('Recommendation');
            res.body.pinwall[7].label.should.equals('Generic');
            res.body.pinwall[7].pageId.should.equals('10');
            res.body.pinwall[7].name.should.equals('user Meier5');
            res.body.pinwall[7].forename.should.equals('user');
            res.body.pinwall[7].userId.should.equals('5');
            res.body.pinwall[7].title.should.equals('generic10Title');
            res.body.pinwall[7].created.should.equals(519);
            res.body.pinwall[7].previewUrl.should.equals('pages/10/preview.jpg');
            res.body.pinwall[7].profileUrl.should.equals('profileImage/5/thumbnail.jpg');
            res.body.pinwall[7].description.should.equals('page10Description');
            res.body.pinwall[7].recommendedByUser.should.equals(false);
            res.body.pinwall[7].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[7].topic.length.should.equals(1);
            res.body.pinwall[7].topic[0].should.equals('health');
        });
    });

    it('Getting newest pages (show all)', function () {

        dbDsl.createPrivacyNoContact(['4', '5', '6'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: false, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact(['3'], {profile: true, image: true, contacts: true, pinwall: false});
        dbDsl.createPrivacy(['1', '2', '3'], 'Freund', {profile: true, image: true,  contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1'], 'Bekannter', {profile: true, image: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createContactConnection('1', '3', 'Bekannter', 500);
        dbDsl.createContactConnection('2', '1', 'Freund', 500);

        dbDsl.createBookPage('0', {adminId: '2', language: ['de'], topic: ['health'], created: 530, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('1', {adminId: '4', language: ['de'], topic: ['health'], created: 529, author: 'HansMuster2', publishDate: 1000});
        dbDsl.createLinkPage('2', {adminId: '4', language: ['de'], topic: ['health'], created: 528, link: 'www.host.com/test', heightPreviewImage: 200});
        dbDsl.createLinkPage('3', {adminId: '5', language: ['de'], topic: ['health'], created: 527, link: 'www.host.com/test2', heightPreviewImage: 201});
        dbDsl.createYoutubePage('4', {
            adminId: '5', language: ['de'], topic: ['health'], created: 526, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
            linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
        });
        dbDsl.createYoutubePage('5', {
            adminId: '6', language: ['de'], topic: ['health'], created: 525, link: 'https://www.youtube.com/watch?v=hTarMdJub0',
            linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0'
        });
        dbDsl.createBlog('6', {blogWriterUserId: '2', language: ['en'], topic: ['health'], created: 524, visible: ['Freund'], pictureHeight: 400});
        dbDsl.createBlog('7', {blogWriterUserId: '3', language: ['en'], topic: ['health'], created: 523, visible: ['Freund']});
        dbDsl.createBlog('8', {blogWriterUserId: '1', language: ['en'], topic: ['health'], created: 522});
        dbDsl.createBlog('9', {blogWriterUserId: '4', language: ['en'], topic: ['health'], created: 521});

        dbDsl.createGenericPage('10', {adminId: '5', language: ['de'], topic: ['health'], created: 519}, [{
            description: 'Zuerich',
            lat: 47.376887,
            lng: 8.541694
        }]);

        dbDsl.crateRecommendationsForPage('1', [{userId: '1', created: 500}, {userId: '3', created: 504}]);
        dbDsl.crateRecommendationsForPage('2', [{userId: '2', created: 501}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '4', created: 502}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '4', created: 503}]);
        dbDsl.crateRecommendationsForPage('9', [{userId: '5', created: 504}]);
        dbDsl.crateRecommendationsForPage('10', [{userId: '5', created: 505}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 20,
                onlyContact: false,
                order: 'new'
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equals(10);

            res.body.pinwall[0].pinwallType.should.equals('Recommendation');
            res.body.pinwall[0].label.should.equals('Book');
            res.body.pinwall[0].pageId.should.equals('0');
            res.body.pinwall[0].name.should.equals('user Meier2');
            res.body.pinwall[0].forename.should.equals('user');
            res.body.pinwall[0].userId.should.equals('2');
            res.body.pinwall[0].title.should.equals('page0Title');
            res.body.pinwall[0].created.should.equals(530);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.pinwall[0].previewUrl.should.equals('pages/0/pagePreview.jpg');
            res.body.pinwall[0].description.should.equals('page0Description');
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[0].topic.length.should.equals(1);
            res.body.pinwall[0].topic[0].should.equals('health');

            res.body.pinwall[1].pinwallType.should.equals('Recommendation');
            res.body.pinwall[1].label.should.equals('Book');
            res.body.pinwall[1].pageId.should.equals('1');
            res.body.pinwall[1].name.should.equals('user Meier4');
            res.body.pinwall[1].forename.should.equals('user');
            res.body.pinwall[1].userId.should.equals('4');
            res.body.pinwall[1].title.should.equals('page1Title');
            res.body.pinwall[1].created.should.equals(529);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
            res.body.pinwall[1].previewUrl.should.equals('pages/1/pagePreview.jpg');
            res.body.pinwall[1].description.should.equals('page1Description');
            res.body.pinwall[1].recommendedByUser.should.equals(true);
            res.body.pinwall[1].totalNumberOfRecommendations.should.equals(2);
            res.body.pinwall[1].topic.length.should.equals(1);
            res.body.pinwall[1].topic[0].should.equals('health');

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals('Link');
            res.body.pinwall[2].pageId.should.equals('2');
            res.body.pinwall[2].name.should.equals('user Meier4');
            res.body.pinwall[2].forename.should.equals('user');
            res.body.pinwall[2].link.should.equals('www.host.com/test');
            res.body.pinwall[2].hostname.should.equals('www.host.com');
            res.body.pinwall[2].userId.should.equals('4');
            res.body.pinwall[2].title.should.equals('page2Title');
            res.body.pinwall[2].created.should.equals(528);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
            res.body.pinwall[2].previewUrl.should.equals('pages/2/preview.jpg');
            res.body.pinwall[2].heightPreviewImage.should.equals(200);
            res.body.pinwall[2].description.should.equals('page2Description');
            res.body.pinwall[2].recommendedByUser.should.equals(false);
            res.body.pinwall[2].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[2].topic.length.should.equals(1);
            res.body.pinwall[2].topic[0].should.equals('health');

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals('Link');
            res.body.pinwall[3].pageId.should.equals('3');
            res.body.pinwall[3].name.should.equals('user Meier5');
            res.body.pinwall[3].forename.should.equals('user');
            res.body.pinwall[3].link.should.equals('www.host.com/test2');
            res.body.pinwall[3].hostname.should.equals('www.host.com');
            res.body.pinwall[3].userId.should.equals('5');
            res.body.pinwall[3].title.should.equals('page3Title');
            res.body.pinwall[3].created.should.equals(527);
            res.body.pinwall[3].profileUrl.should.equals('profileImage/5/thumbnail.jpg');
            res.body.pinwall[3].previewUrl.should.equals('pages/3/preview.jpg');
            res.body.pinwall[3].heightPreviewImage.should.equals(201);
            res.body.pinwall[3].description.should.equals('page3Description');
            res.body.pinwall[3].recommendedByUser.should.equals(false);
            res.body.pinwall[3].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[3].topic.length.should.equals(1);
            res.body.pinwall[3].topic[0].should.equals('health');

            res.body.pinwall[4].pinwallType.should.equals('Recommendation');
            res.body.pinwall[4].label.should.equals('Youtube');
            res.body.pinwall[4].link.should.equals('https://www.youtube.com/watch?v=hTarMdJub0M');
            res.body.pinwall[4].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0M');
            res.body.pinwall[4].pageId.should.equals('4');
            res.body.pinwall[4].name.should.equals('user Meier5');
            res.body.pinwall[4].forename.should.equals('user');
            res.body.pinwall[4].userId.should.equals('5');
            res.body.pinwall[4].title.should.equals('page4Title');
            res.body.pinwall[4].created.should.equals(526);
            res.body.pinwall[4].profileUrl.should.equals('profileImage/5/thumbnail.jpg');
            res.body.pinwall[4].description.should.equals('page4Description');
            res.body.pinwall[4].recommendedByUser.should.equals(false);
            res.body.pinwall[4].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[4].topic.length.should.equals(1);
            res.body.pinwall[4].topic[0].should.equals('health');

            res.body.pinwall[5].pinwallType.should.equals('Recommendation');
            res.body.pinwall[5].label.should.equals('Youtube');
            res.body.pinwall[5].link.should.equals('https://www.youtube.com/watch?v=hTarMdJub0');
            res.body.pinwall[5].linkEmbed.should.equals('https://www.youtube.com/embed/hTarMdJub0');
            res.body.pinwall[5].pageId.should.equals('5');
            res.body.pinwall[5].name.should.equals('user Meier6');
            res.body.pinwall[5].forename.should.equals('user');
            res.body.pinwall[5].userId.should.equals('6');
            res.body.pinwall[5].title.should.equals('page5Title');
            res.body.pinwall[5].created.should.equals(525);
            res.body.pinwall[5].profileUrl.should.equals('profileImage/6/thumbnail.jpg');
            res.body.pinwall[5].description.should.equals('page5Description');
            res.body.pinwall[5].recommendedByUser.should.equals(false);
            res.body.pinwall[5].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[5].topic.length.should.equals(1);
            res.body.pinwall[5].topic[0].should.equals('health');

            res.body.pinwall[6].pinwallType.should.equals('Blog');
            res.body.pinwall[6].pageId.should.equals('6');
            res.body.pinwall[6].name.should.equals('user Meier2');
            res.body.pinwall[6].forename.should.equals('user');
            res.body.pinwall[6].userId.should.equals('2');
            res.body.pinwall[6].created.should.equals(524);
            res.body.pinwall[6].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            should.exist(res.body.pinwall[6].previewUrl);
            res.body.pinwall[6].title.should.equals('blog6Title');
            res.body.pinwall[6].text.should.equals('blog6Text');
            res.body.pinwall[6].isAdmin.should.equals(false);
            res.body.pinwall[6].isPublic.should.equals(false);
            res.body.pinwall[6].recommendedByUser.should.equals(false);
            res.body.pinwall[6].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[6].topic.length.should.equals(1);
            res.body.pinwall[6].topic[0].should.equals('health');

            res.body.pinwall[7].pinwallType.should.equals('Blog');
            res.body.pinwall[7].pageId.should.equals('8');
            res.body.pinwall[7].name.should.equals('user Meier');
            res.body.pinwall[7].forename.should.equals('user');
            res.body.pinwall[7].userId.should.equals('1');
            res.body.pinwall[7].created.should.equals(522);
            res.body.pinwall[7].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            should.not.exist(res.body.pinwall[7].previewUrl);
            res.body.pinwall[7].title.should.equals('blog8Title');
            res.body.pinwall[7].text.should.equals('blog8Text');
            res.body.pinwall[7].isAdmin.should.equals(true);
            res.body.pinwall[7].isPublic.should.equals(true);
            res.body.pinwall[7].recommendedByUser.should.equals(false);
            res.body.pinwall[7].totalNumberOfRecommendations.should.equals(0);
            res.body.pinwall[7].topic.length.should.equals(1);
            res.body.pinwall[7].topic[0].should.equals('health');

            res.body.pinwall[8].pinwallType.should.equals('Blog');
            res.body.pinwall[8].pageId.should.equals('9');
            res.body.pinwall[8].name.should.equals('user Meier4');
            res.body.pinwall[8].forename.should.equals('user');
            res.body.pinwall[8].userId.should.equals('4');
            res.body.pinwall[8].created.should.equals(521);
            res.body.pinwall[8].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
            should.not.exist(res.body.pinwall[8].previewUrl);
            res.body.pinwall[8].title.should.equals('blog9Title');
            res.body.pinwall[8].text.should.equals('blog9Text');
            res.body.pinwall[8].isAdmin.should.equals(false);
            res.body.pinwall[8].isPublic.should.equals(true);
            res.body.pinwall[8].recommendedByUser.should.equals(false);
            res.body.pinwall[8].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[8].topic.length.should.equals(1);
            res.body.pinwall[8].topic[0].should.equals('health');

            res.body.pinwall[9].pinwallType.should.equals('Recommendation');
            res.body.pinwall[9].label.should.equals('Generic');
            res.body.pinwall[9].pageId.should.equals('10');
            res.body.pinwall[9].name.should.equals('user Meier5');
            res.body.pinwall[9].forename.should.equals('user');
            res.body.pinwall[9].userId.should.equals('5');
            res.body.pinwall[9].title.should.equals('generic10Title');
            res.body.pinwall[9].created.should.equals(519);
            res.body.pinwall[9].previewUrl.should.equals('pages/10/preview.jpg');
            res.body.pinwall[9].profileUrl.should.equals('profileImage/5/thumbnail.jpg');
            res.body.pinwall[9].description.should.equals('page10Description');
            res.body.pinwall[9].recommendedByUser.should.equals(false);
            res.body.pinwall[9].totalNumberOfRecommendations.should.equals(1);
            res.body.pinwall[9].topic.length.should.equals(1);
            res.body.pinwall[5].topic[0].should.equals('health');
        });
    });
});
