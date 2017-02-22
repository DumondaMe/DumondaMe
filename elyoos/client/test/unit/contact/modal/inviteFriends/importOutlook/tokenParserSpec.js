'use strict';

var Testee = require('../../../../../../app/modules/contact/modal/inviteFriends/importOutlook/services/codeParser')[0];
var testee = new Testee();

describe('Tests the oAuth code parser for outlook', function () {

    it('Parse outlook url and get code', function () {

        var result = testee.parseUrl("https://www.elyoos.org/auth?code=M218e7b75-92b2-2e36-d7e7-745232dc1ce3");

        expect(result).to.equal("M218e7b75-92b2-2e36-d7e7-745232dc1ce3");
    });

});
