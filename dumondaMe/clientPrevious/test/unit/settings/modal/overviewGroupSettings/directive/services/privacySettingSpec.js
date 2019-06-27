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
            group: [{
                type: 'Bekannter',
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: true
            }, {
                type: 'Freund',
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: true
            }],
            noContact: {
                profileVisible: true,
                contactsVisible: true,
                pinwallVisible: true,
                imageVisible: true
            }
        };
        result = testee.getSelectedGroups(testData, 'imageVisible');
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('Alle');
    });

    it('Getting only one Group selected', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }, {
                type: 'Freund',
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: false
            }],
            noContact: {
                profileVisible: false,
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }
        };
        result = testee.getSelectedGroups(testData, 'imageVisible');
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('Freund');
    });

    it('Getting only contact visibility selected', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }, {
                type: 'Freund',
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }],
            noContact: {
                profileVisible: false,
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }
        };
        result = testee.getSelectedProfileVisible(testData);
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('Nur Kontakte');
    });

    it('Getting all visibility selected', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }, {
                type: 'Freund',
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }],
            noContact: {
                profileVisible: true,
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }
        };
        result = testee.getSelectedProfileVisible(testData);
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('Alle');
    });

    it('Setting privacy profile visible from all to only visible for contacts', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                contactsVisible: true,
                imageVisible: false,
                pinwallVisible: false
            }, {
                type: 'Freund',
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: true
            }],
            noContact: {
                profileVisible: true,
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }
        }, selectedProfileVisible = ['Nur Kontakte'];
        result = testee.setPrivacySettingProfileVisible(testData, selectedProfileVisible);
        expect(result.group[0].type).to.equal('Bekannter');
        expect(result.group[0].contactsVisible).to.equal(true);
        expect(result.group[0].imageVisible).to.equal(false);
        expect(result.group[0].pinwallVisible).to.equal(false);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].contactsVisible).to.equal(false);
        expect(result.group[1].imageVisible).to.equal(true);
        expect(result.group[1].pinwallVisible).to.equal(true);

        expect(result.noContact.profileVisible).to.equal(false);
        expect(result.noContact.contactsVisible).to.equal(false);
        expect(result.noContact.imageVisible).to.equal(false);
        expect(result.noContact.pinwallVisible).to.equal(false);
    });

    it('Setting privacy profile visible from only visible for contacts to visible for all', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: false
            }, {
                type: 'Freund',
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: true
            }],
            noContact: {
                profileVisible: false,
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }
        }, selectedProfileVisible = ['Alle'];
        result = testee.setPrivacySettingProfileVisible(testData, selectedProfileVisible);
        expect(result.group[0].type).to.equal('Bekannter');
        expect(result.group[0].contactsVisible).to.equal(false);
        expect(result.group[0].imageVisible).to.equal(true);
        expect(result.group[0].pinwallVisible).to.equal(false);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].contactsVisible).to.equal(false);
        expect(result.group[1].imageVisible).to.equal(true);
        expect(result.group[1].pinwallVisible).to.equal(true);

        expect(result.noContact.profileVisible).to.equal(true);
        expect(result.noContact.contactsVisible).to.equal(false);
        expect(result.noContact.imageVisible).to.equal(false);
        expect(result.noContact.pinwallVisible).to.equal(false);
    });

    it('Set a privacy property from all to only Freund', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }, {
                type: 'Freund',
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }],
            noContact: {
                profileVisible: true,
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }
        }, selected = ['Freund'];
        result = testee.setPrivacySetting(testData, selected, 'contactsVisible');
        expect(result.group[0].type).to.equal('Bekannter');
        expect(result.group[0].contactsVisible).to.equal(false);
        expect(result.group[0].imageVisible).to.equal(true);
        expect(result.group[0].pinwallVisible).to.equal(true);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].contactsVisible).to.equal(true);
        expect(result.group[1].imageVisible).to.equal(true);
        expect(result.group[1].pinwallVisible).to.equal(true);

        expect(result.noContact.profileVisible).to.equal(true);
        expect(result.noContact.contactsVisible).to.equal(false);
        expect(result.noContact.imageVisible).to.equal(true);
        expect(result.noContact.pinwallVisible).to.equal(true);
    });

    it('Set a privacy property Freund to visible for all', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: true
            }, {
                type: 'Freund',
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }],
            noContact: {
                profileVisible: true,
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }
        }, selected = ['Alle'];
        result = testee.setPrivacySetting(testData, selected, 'contactsVisible');
        expect(result.group[0].type).to.equal('Bekannter');
        expect(result.group[0].contactsVisible).to.equal(true);
        expect(result.group[0].imageVisible).to.equal(true);
        expect(result.group[0].pinwallVisible).to.equal(true);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].contactsVisible).to.equal(true);
        expect(result.group[1].imageVisible).to.equal(false);
        expect(result.group[1].pinwallVisible).to.equal(false);

        expect(result.noContact.profileVisible).to.equal(true);
        expect(result.noContact.contactsVisible).to.equal(true);
        expect(result.noContact.imageVisible).to.equal(false);
        expect(result.noContact.pinwallVisible).to.equal(false);
    });
});
