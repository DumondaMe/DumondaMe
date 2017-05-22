'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests to get known user by the contacts', function () {

    beforeEach(function () {
        return dbDsl.init(11);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting contacts knowing the user', function () {
        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '2', 'Freund');
        dbDsl.createContactConnection('1', '3', 'Freund');
        dbDsl.createContactConnection('1', '4', 'Freund');
        dbDsl.createContactConnection('1', '5', 'Freund');
        dbDsl.createContactConnection('1', '6', 'Freund');
        dbDsl.createContactConnection('1', '7', 'Freund');
        dbDsl.createContactConnection('3', '8', 'Freund');
        dbDsl.createContactConnection('5', '8', 'Freund');
        dbDsl.createContactConnection('6', '8', 'Freund');
        dbDsl.createContactConnection('7', '8', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.get('/api/user/contact/knowUser', {
                userId: '8',
                skip: 0,
                maxItems: 3
            });
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.contacts.length.should.equals(3);

            res.body.contacts[0].name.should.equals('user Meier3');
            res.body.contacts[1].name.should.equals('user Meier5');
            res.body.contacts[2].name.should.equals('user Meier6');

            res.body.totalNumberOfContacts.should.equals(4);
        });
    });
});
