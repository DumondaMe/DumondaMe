'use strict';

var CountryCodeConverter = require('../../../app/modules/util/countryCodeConverter');

describe('Tests of country code converter', function () {

    beforeEach(function (done) {
        done();
    });

    it('Successful getting german description for german code', function () {

        var service = new CountryCodeConverter(), description;

        description = service.getCountry('DE');

        expect(description).to.equals('Deutschland');
    });

    it('Successful getting german code for german description', function () {

        var service = new CountryCodeConverter(), description;

        description = service.getCountryCode('Deutschland');

        expect(description).to.equals('DE');
    });
});
