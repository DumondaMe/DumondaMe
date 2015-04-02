'use strict';

var detailContactCtrl = require('../../../app/modules/contact/detailContactCtrl')[6];
var moment = require('../../../app/lib/moment/moment');

describe('Tests of the detail contact controller', function () {
    var scope, state, stateParams, ContactUserActions, ContactDetail, CountryCodeConverter;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            ContactDetail = {};
            ContactDetail.get = function () {
            };

            ContactUserActions = {};
            ContactUserActions.setConnectionState = function () {
            };
            ContactUserActions.setPrivacySettings = function () {
            };

            state = {};
            state.go = function () {
            };

            stateParams = {};

            CountryCodeConverter = {};
            CountryCodeConverter.countryCodes = [];

            CountryCodeConverter.getCountryCode = function () {
            };
            CountryCodeConverter.getCountry = function () {
            };

            scope = $rootScope.$new();
            done();
        });
    });

    it('Open the contact detail page', function () {

        var getContactDetail = sinon.stub(ContactDetail, 'get'),
            getCountry = sinon.stub(CountryCodeConverter, 'getCountry'),
            response = {
                contact: {
                    name: 'Hans Muster',
                    country: 'CH',
                    birthday: 385948800
                },
                statistic: 'statistic',
                privacySettings: 'privacySettings'
            };

        moment.locale('de');
        stateParams.userId = '2';

        getContactDetail.withArgs({userId: '2'}).returns(response);
        getCountry.withArgs('CH').returns('Schweiz');

        detailContactCtrl(scope, stateParams, ContactDetail, moment, CountryCodeConverter, ContactUserActions);
        getContactDetail.callArg(1);


        expect(scope.contact.country).to.equals('Schweiz');
        expect(scope.contact.birthday).to.equals('Geb. 26.3.1982');
        expect(scope.contact.id).to.equals('2');
        expect(scope.statistic).to.equals('statistic');
        expect(scope.privacySettings).to.equals('privacySettings');
    });

    it('Open the contact detail page with missing country and birthday', function () {

        var getContactDetail = sinon.stub(ContactDetail, 'get'),
            getCountry = sinon.stub(CountryCodeConverter, 'getCountry'),
            response = {
                contact: {
                    name: 'Hans Muster'
                },
                statistic: 'statistic',
                privacySettings: 'privacySettings'
            };

        moment.locale('de');
        stateParams.userId = '2';

        getContactDetail.withArgs({userId: '2'}).returns(response);
        getCountry.withArgs('CH').returns('Schweiz');

        detailContactCtrl(scope, stateParams, ContactDetail, moment, CountryCodeConverter, ContactUserActions);
        getContactDetail.callArg(1);


        expect(scope.contact.country).to.be.undefined;
        expect(scope.contact.birthday).to.be.undefined;
        expect(scope.contact.id).to.equals('2');
        expect(scope.statistic).to.equals('statistic');
        expect(scope.privacySettings).to.equals('privacySettings');
    });
});
