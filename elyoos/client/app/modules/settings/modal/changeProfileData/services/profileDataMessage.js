'use strict';

module.exports = ['moment', 'CountryCodeConverter',
    function (moment, CountryCodeConverter) {
        var service = this;

        service.getMessage = function (data) {
            return {
                forename: data.forename,
                surname: data.surname,
                birthday: moment.utc(data.birthday, 'l', moment.locale(), true).valueOf() / 1000,
                country: data.selectedCountryCode.code,
                female: data.female === 'true'
            };
        };

        service.convertReceivedMessage = function (data) {
            data.birthday = moment.unix(data.birthday).format('l');
            data.selectedCountryCode = {
                code: data.country,
                country: CountryCodeConverter.getCountry(data.country)
            };
            data.female = data.female.toString();
        };
    }]
;
