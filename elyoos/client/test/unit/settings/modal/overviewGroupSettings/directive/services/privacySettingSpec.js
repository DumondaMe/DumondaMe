'use strict';

var PrivacySetting = require('../../../../../../../app/modules/settings/modal/overviewGroupSettings/directive/services/privacySetting')[0];

describe('Test of PrivacySetting Service', function () {

    var testee;

    beforeEach(function (done) {
        testee = new PrivacySetting();
        done();
    });

    it('Getting all selected', function () {
        var result, testData = {
            normal: [{
                type: 'Bekannter',
                profileVisible: true,
                profileDataVisible: false,
                imageVisible: false
            }, {
                type: 'Freund',
                profileVisible: true,
                profileDataVisible: false,
                imageVisible: false
            }],
            noContact: {
                profileVisible: true,
                profileDataVisible: false,
                imageVisible: false
            }
        };
        result = testee.getSelectedGroups(testData, 'profileVisible');
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('Alle');
    });

    it('Getting only one Group selected', function () {
        var result, testData = {
            normal: [{
                type: 'Bekannter',
                profileVisible: false,
                profileDataVisible: false,
                imageVisible: false
            }, {
                type: 'Freund',
                profileVisible: false,
                profileDataVisible: false,
                imageVisible: true
            }],
            noContact: {
                profileVisible: false,
                profileDataVisible: false,
                imageVisible: false
            }
        };
        result = testee.getSelectedGroups(testData, 'imageVisible');
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('Freund');
    });
});
