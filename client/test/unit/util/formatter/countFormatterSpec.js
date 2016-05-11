'use strict';

var Testee = require('../../../../app/modules/util/formatter/countFormatter')[0];
var testee = new Testee();

describe('Tests of the count formatting', function () {

    it('Count smaller than 1000 returns count without change', function () {

        var result = testee.getCount(999);

        expect(result).to.equal("999");
    });

    it('Count bigger or equal than 1000 returns count with appendix k', function () {

        var result = testee.getCount(1000);

        expect(result).to.equal("1k");
    });

    it('Count bigger than 1000 and smaller then 1000000 returns count with appendix k', function () {

        var result = testee.getCount(999999);

        expect(result).to.equal("999k");
    });

    it('Count bigger than 1000000 returns count with appendix m', function () {

        var result = testee.getCount(1000000);

        expect(result).to.equal("1m");
    });

});
