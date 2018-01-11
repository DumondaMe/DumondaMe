'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting additional user info on the home screen', function () {

    beforeEach(function () {
        return dbDsl.init(6).then(function () {

            dbDsl.createBookPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'HansMuster', publishDate: 1000});
            dbDsl.createLinkPage('2', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'www.host.com/test', heightPreviewImage: 200});
            dbDsl.createYoutubePage('1', {
                language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, link: 'https://www.youtube.com/watch?v=hTarMdJub0M',
                linkEmbed: 'https://www.youtube.com/embed/hTarMdJub0M'
            });
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

    it('Getting the contacts who have added user since at least last 24 hours', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact('1', {profile: false, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacyNoContact('2', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createPrivacy(['2'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.setUserLastLoginTime(startTime);
        dbDsl.createContactConnection('2', '1', 'Freund', startTime - 86000);
        dbDsl.createContactConnection('1', '2', 'Freund', startTime - 1000);


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

            res.body.contacting.users.length.should.equals(1);
            res.body.contacting.users[0].userId.should.equals('2');
            res.body.contacting.users[0].name.should.equals('user Meier2');
            res.body.contacting.users[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
            res.body.contacting.users[0].contactAdded.should.equals(startTime - 86000);
            res.body.contacting.users[0].contactOfUser.should.equals(true);

            res.body.contacting.numberOfContacting.should.equals(1);
        });
    });
});
