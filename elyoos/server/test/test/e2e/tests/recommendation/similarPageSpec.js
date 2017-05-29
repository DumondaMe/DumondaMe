'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting similar pages for a page', function () {

    beforeEach(function () {
        return dbDsl.init(12);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Similar pages recommended by the contacts of the user, all cases', function () {

        /*dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});*/

        dbDsl.createContactConnection('1', '2', 'Freund', 500);
        dbDsl.createContactConnection('1', '3', 'Freund', 500);
        dbDsl.createContactConnection('1', '4', 'Freund', 500);

        dbDsl.createBookPage('1', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 500, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('2', {language: ['de'], topic: ['spiritual', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('3', {language: ['de'], topic: ['health'], created: 502, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('4', {language: ['de'], topic: ['personalDevelopment'], created: 503, author: 'HansMuster', publishDate: 1000});
        dbDsl.createLinkPage('5', {language: ['de'], topic: ['personalDevelopment'], created: 504, link: 'www.host.com/test'});
        dbDsl.createLinkPage('6', {language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test'});
        dbDsl.createGenericPage('7', {adminId: '3', language: ['de'], topic: ['health', 'personalDevelopment'], created: 501}, [{
            description: 'Zuerich',
            lat: 47.376887,
            lng: 8.541694
        }]);
        dbDsl.createYoutubePage('8', {
            language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
            linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
        });
        dbDsl.createLinkPage('9', {language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test2'});
        dbDsl.createBookPage('10', {language: ['de'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});
        dbDsl.createLinkPage('11', {language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test3'});
        dbDsl.createLinkPage('12', {language: ['de'], topic: ['health'], created: 505, link: 'www.host.com/test4'});
        dbDsl.createBookPage('13', {language: ['de'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});
        dbDsl.createBookPage('14', {language: ['de'], topic: ['personalDevelopment'], created: 502, author: 'HansMuster', publishDate: 1000});


        dbDsl.crateRecommendationsForPage('1', [{userId: '2', created: 500},
            {userId: '3', created: 500},
            {userId: '5', created: 500},
            {userId: '6', created: 500},
            {userId: '7', created: 500}]);

        //Used for algorithm
        dbDsl.crateRecommendationsForPage('2', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('3', [{userId: '1', created: 500}, {userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('4', [{userId: '1', created: 500}, {userId: '3', created: 500}]);
        dbDsl.crateRecommendationsForPage('5', [{userId: '1', created: 500}, {userId: '5', created: 500}]);
        dbDsl.crateRecommendationsForPage('6', [{userId: '1', created: 500}, {userId: '5', created: 500}]);
        dbDsl.crateRecommendationsForPage('7', [{userId: '1', created: 500}, {userId: '6', created: 500}]);
        //Recommended pages
        dbDsl.crateRecommendationsForPage('8', [{userId: '2', created: 500}]);
        dbDsl.crateRecommendationsForPage('9', [{userId: '3', created: 500}]);
        dbDsl.crateRecommendationsForPage('10', [{userId: '5', created: 500}]);
        dbDsl.crateRecommendationsForPage('11', [{userId: '6', created: 500}]);
        dbDsl.crateRecommendationsForPage('12', [{userId: '8', created: 500},
            {userId: '9', created: 500},
            {userId: '10', created: 500},
            {userId: '11', created: 500}]);
        dbDsl.crateRecommendationsForPage('13', [{userId: '9', created: 500},
            {userId: '10', created: 500},
            {userId: '11', created: 500}]);
        dbDsl.crateRecommendationsForPage('14', [{userId: '7', created: 500}]);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser).then(function () {
                return requestHandler.get('/api/recommendation/similarPage', {
                    pageId: '1',
                    skip: 0,
                    maxItems: 10
                });
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pages.length.should.equals(6);

                res.body.pages[0].label.should.equals("Youtube");
                res.body.pages[0].pageId.should.equals("8");

                res.body.pages[1].label.should.equals("Link");
                res.body.pages[1].pageId.should.equals("9");

                res.body.pages[2].label.should.equals("Book");
                res.body.pages[2].pageId.should.equals("10");

                res.body.pages[3].label.should.equals("Link");
                res.body.pages[3].pageId.should.equals("11");

                res.body.pages[4].label.should.equals("Link");
                res.body.pages[4].pageId.should.equals("12");

                res.body.pages[5].label.should.equals("Book");
                res.body.pages[5].pageId.should.equals("13");
            });
        });
    });
});
