'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests to get the same contacts', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(11);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting same contacts of a user', function () {
        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '3', 'Freund');
        dbDsl.createContactConnection('1', '5', 'Freund');
        dbDsl.createContactConnection('1', '7', 'Freund');
        dbDsl.createContactConnection('1', '8', 'Freund');
        dbDsl.createContactConnection('1', '9', 'Freund');
        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('2', '4', 'Freund');
        dbDsl.createContactConnection('2', '5', 'Freund');
        dbDsl.createContactConnection('2', '6', 'Freund');
        dbDsl.createContactConnection('2', '7', 'Freund');


        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/sameContact', {
                userId: '2',
                skip: 0,
                maxItems: 10
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.users.length.should.equals(3);

            res.body.users[0].name.should.equals('user Meier3');
            res.body.users[1].name.should.equals('user Meier5');
            res.body.users[2].name.should.equals('user Meier7');
        });
    });
});
