'use strict';

var Testee = require('../../../../../app/modules/contact/modal/inviteFriends/services/tokenParser')[0];
var testee = new Testee();

describe('Tests the oAuth token parser', function () {

    it('Parse google url', function () {

        var result = testee.parseGoogleUrl("https://www.elyoos.org/auth?code=4/20zaaI808GeW5F1S-zxVDCTJ3Gm9I7jH2XpHq2HUxJc#");

        expect(result).to.equal("4/20zaaI808GeW5F1S-zxVDCTJ3Gm9I7jH2XpHq2HUxJc#");
    });

});
