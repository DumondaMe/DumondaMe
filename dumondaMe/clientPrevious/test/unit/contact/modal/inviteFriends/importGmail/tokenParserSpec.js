'use strict';

var Testee = require('../../../../../../app/modules/contact/modal/inviteFriends/importGmail/services/codeParser')[0];
var testee = new Testee();

describe('Tests the oAuth code parser', function () {

    it('Parse google url and get code', function () {

        var result = testee.parseUrl("https://www.elyoos.org/auth?code=4/20zaaI808GeW5F1S-zxVDCTJ3Gm9I7jH2XpHq2HUxJc#");

        expect(result).to.equal("4/20zaaI808GeW5F1S-zxVDCTJ3Gm9I7jH2XpHq2HUxJc");
    });

});
