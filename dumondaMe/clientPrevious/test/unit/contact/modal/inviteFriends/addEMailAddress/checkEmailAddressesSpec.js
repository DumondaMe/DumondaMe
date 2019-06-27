'use strict';

var Testee = require('../../../../../../app/modules/contact/modal/inviteFriends/addEMailAddress/services/checkEmailAddresses')[0];
var testee = new Testee();

describe('Tests checking if is a valid email address', function () {

    it('Valid single email address', function () {

        var result = testee.checkAddresses("test@elyoos.org");

        expect(result).to.be.true;
    });

    it('Valid multiple email addresses (comma separated)', function () {

        var result = testee.checkAddresses("test@elyoos.org, test2@elyoos.org, test3@elyoos.org");

        expect(result).to.be.true;
    });

    it('Valid multiple email addresses (blank separated)', function () {

        var result = testee.checkAddresses("test@elyoos.org test2@elyoos.org test3@elyoos.org");

        expect(result).to.be.true;
    });

    it('Valid multiple email addresses (semicolon separated)', function () {

        var result = testee.checkAddresses("test@elyoos.org; test2@elyoos.org; test3@elyoos.org");

        expect(result).to.be.true;
    });

    it('Valid multiple email addresses (miscellaneous separated)', function () {

        var result = testee.checkAddresses("test@elyoos.org; test2@elyoos.org test3@elyoos.org, test4@elyoos.org");

        expect(result).to.be.true;
    });


    it('One invalid email address multiple email addresses (comma separated)', function () {

        var result = testee.checkAddresses("test@elyoos.org, test2elyoos.org, test3@elyoos.org");

        expect(result).to.be.false;
    });

    it('One invalid email address multiple email addresses (blank separated)', function () {

        var result = testee.checkAddresses("test@elyoos.org test2elyoos.org test3@elyoos.org");

        expect(result).to.be.false;
    });

    it('One invalid email address multiple email addresses (semicolon separated)', function () {

        var result = testee.checkAddresses("test@elyoos.org; test2@elyoos.org; test3elyoos.org");

        expect(result).to.be.false;
    });

    it('Invalid single email address', function () {

        var result = testee.checkAddresses("testelyoos.org");

        expect(result).to.be.false;
    });

    it('Empty string is invalid', function () {

        var result = testee.checkAddresses("");

        expect(result).to.be.false;
    });
});
