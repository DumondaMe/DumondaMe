'use strict';

var Testee = require('../../../../../../app/modules/contact/modal/inviteFriends/addEMailAddress/services/emailAddressParser')[1];
var mailchecker = require('../../../../../../app/modules/util/mailcheck.js');
var testee = new Testee(mailchecker());

describe('Tests parsing email addresses', function () {

    it('Parse a single email address', function () {

        var result = testee.parse("test@elyoos.org");

        expect(result.length).to.equal(1);
        expect(result[0].email).to.equal('test@elyoos.org');
        expect(result[0].manuallyAdded).to.be.true;
    });

    it('Parse multiple email addresses (comma separated)', function () {

        var result = testee.parse("test@elyoos.org, test2@elyoos.org, test3@elyoos.org");

        expect(result.length).to.equal(3);
        expect(result[0].email).to.equal('test@elyoos.org');
        expect(result[0].manuallyAdded).to.be.true;
        expect(result[1].email).to.equal('test2@elyoos.org');
        expect(result[1].manuallyAdded).to.be.true;
        expect(result[2].email).to.equal('test3@elyoos.org');
        expect(result[2].manuallyAdded).to.be.true;
    });

    it('Pase multiple email addresses (blank separated)', function () {

        var result = testee.parse("test@elyoos.org test2@elyoos.org test3@elyoos.org");

        expect(result.length).to.equal(3);
        expect(result[0].email).to.equal('test@elyoos.org');
        expect(result[0].manuallyAdded).to.be.true;
        expect(result[1].email).to.equal('test2@elyoos.org');
        expect(result[1].manuallyAdded).to.be.true;
        expect(result[2].email).to.equal('test3@elyoos.org');
        expect(result[2].manuallyAdded).to.be.true;
    });

    it('Parse multiple email addresses (semicolon separated)', function () {

        var result = testee.parse("test@elyoos.org; test2@elyoos.org; test3@elyoos.org");

        expect(result.length).to.equal(3);
        expect(result[0].email).to.equal('test@elyoos.org');
        expect(result[0].manuallyAdded).to.be.true;
        expect(result[1].email).to.equal('test2@elyoos.org');
        expect(result[1].manuallyAdded).to.be.true;
        expect(result[2].email).to.equal('test3@elyoos.org');
        expect(result[2].manuallyAdded).to.be.true;
    });

    it('Parse multiple email addresses (miscellaneous separated)', function () {

        var result = testee.parse("test@elyoos.org; test2@elyoos.org, test3@elyoos.org test4@elyoos.org  \n test5@elyoos.org");

        expect(result.length).to.equal(5);
        expect(result[0].email).to.equal('test@elyoos.org');
        expect(result[0].manuallyAdded).to.be.true;
        expect(result[1].email).to.equal('test2@elyoos.org');
        expect(result[1].manuallyAdded).to.be.true;
        expect(result[2].email).to.equal('test3@elyoos.org');
        expect(result[2].manuallyAdded).to.be.true;
        expect(result[3].email).to.equal('test4@elyoos.org');
        expect(result[3].manuallyAdded).to.be.true;
        expect(result[4].email).to.equal('test5@elyoos.org');
        expect(result[4].manuallyAdded).to.be.true;
    });
});
