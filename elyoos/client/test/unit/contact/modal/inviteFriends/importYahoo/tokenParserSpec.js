'use strict';

var Testee = require('../../../../../../app/modules/contact/modal/inviteFriends/importYahoo/services/codeParser')[0];
var testee = new Testee();

describe('Tests the oAuth code parser for yahoo', function () {

    it('Parse outlook url and get code', function () {

        var result = testee.parseYahooUrl("https://www.elyoos.org/auth?code=f6g4a9h");

        expect(result).to.equal("f6g4a9h");
    });

});
