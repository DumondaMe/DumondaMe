'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting blogs on home screen for a user', function () {

    beforeEach(function () {

        return dbDsl.init(6).then(function () {
            dbDsl.createBookPage('0', {language: ['de'], topic: ['health', 'personalDevelopment'], created: 501, author: 'Hans Muster', publishDate: 1000});
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


    it('Showing blog which has correct visible for contact type', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: false, contacts: true, pinwall: false});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Bekannter', {profile: true, image: true, contacts: true, pinwall: true});

        dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health'], visible: ['Freund'], created: 501});

        dbDsl.createContactConnection('1', '2', 'Freund', startTime);
        dbDsl.createContactConnection('2', '1', 'Freund', startTime);

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
            res.body.pinwall.length.should.equals(1);
            res.body.pinwall[0].pageId.should.equal('3');
        });
    });

    it('Showing blog which is set to public (is contact, profile: true, pinwall: true)', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: false, contacts: false, pinwall: false});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', startTime);
        dbDsl.createContactConnection('2', '1', 'Freund', startTime);

        dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health'], created: 501});
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
            res.body.pinwall.length.should.equals(1);
            res.body.pinwall[0].pageId.should.equal('3');
        });
    });

    it('Showing blog which is set to public (is not contact, profile: true, pinwall: true)', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: false, contacts: false, pinwall: false});
        dbDsl.createContactConnection('1', '2', 'Freund', startTime);

        dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health'], created: 501});
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
            res.body.pinwall.length.should.equals(1);
            res.body.pinwall[0].pageId.should.equal('3');
        });
    });

    it('Not showing blog which is set to public (is contact, profile: true, pinwall: false)', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, contacts: true, pinwall: false});
        dbDsl.createContactConnection('1', '2', 'Freund', startTime);
        dbDsl.createContactConnection('2', '1', 'Freund', startTime);

        dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health'], created: 501});
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
            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Not showing blog which is set to public (is not contact, profile: true, pinwall: false)', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: true, image: true, contacts: true, pinwall: false});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', startTime);

        dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health'], created: 501});
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
            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Not showing blog which is set to public (is not contact, profile: true, pinwall: false)', function () {

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});

        dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health'], created: 501});
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: false,
                order: 'new'
            });
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Not showing blog which has incorrect visible for contact', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: false, contacts: false, pinwall: false});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', startTime);
        dbDsl.createContactConnection('2', '1', 'Freund', startTime);

        dbDsl.createBlog('3', {blogWriterUserId: '2', language: ['de'], topic: ['health'], visible: ['Familie'], created: 501});

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
            res.body.pinwall.length.should.equals(0);
        });
    });

    it('Not showing blog because contact has user blocked', function () {

        let startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createPrivacyNoContact(['1', '2'], {profile: false, image: false, contacts: false, pinwall: false});
        dbDsl.createPrivacy(['1', '2'], 'Freund', {profile: true, image: true, contacts: true, pinwall: true});
        dbDsl.createContactConnection('1', '2', 'Freund', startTime);
        dbDsl.createContactConnection('2', '1', 'Freund', startTime);
        dbDsl.blockUser('2', '1');

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

            res.body.pinwall.length.should.equals(0);
        });
    });

});
