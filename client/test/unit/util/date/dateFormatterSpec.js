'use strict';

var dateFormatter = require('../../../../app/modules/util/date/dateFormatter')[1];
var moment = require('moment');

describe('Tests of the date formatting', function () {

    beforeEach(function (done) {
        inject(function () {
            done();
        });
    });

    it('Formatted Date is today', function () {

        var formatter = new dateFormatter(moment),
            startTime = Math.floor(moment.utc().valueOf() / 1000),
            result;
        result = formatter.format(startTime - 10);

        expect(result).to.equal('Heute');
    });

    it('Formatted Date is yesterday', function () {

        var formatter = new dateFormatter(moment),
            momentTest,
            result;
        momentTest = moment.utc().subtract(1, 'day');
        result = formatter.format(Math.floor(momentTest.endOf('day').valueOf() / 1000) - (moment().utcOffset() * 60) - 1);

        expect(result).to.equal('Gestern');
    });

    it('Formatted Date older then two days', function () {

        var formatter = new dateFormatter(moment),
            momentTest,
            result;
        momentTest = moment.utc().subtract(2, 'day');
        result = formatter.format(Math.floor(momentTest.endOf('day').valueOf() / 1000) - (moment().utcOffset() * 60) - 1);

        expect(result).to.equal(momentTest.format('l'));
    });

});
