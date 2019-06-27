'use strict';

var parseTime = require('../../../../../app/modules/common/dateTimePicker/services/parseTime')[0];

describe('Test of Parse Time Service', function () {

    var testee;

    beforeEach(function (done) {
        testee = new parseTime();
        done();
    });

    it('Parse a valid time', function () {
        var result = testee.parseTime('12:10');
        expect(result.hour).to.equal(12);
        expect(result.minute).to.equal(10);
    });

    it('Parse a undefined time', function () {
        var result = testee.parseTime();
        expect(result.hour).to.equal(undefined);
        expect(result.minute).to.equal(undefined);
    });
});
