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
                profileVisible: true,
                contactsVisible: false,
                imageVisible: false
            }, {
                type: 'Freund',
                profileVisible: true,
                contactsVisible: false,
                imageVisible: false
            }],
            noContact: {
                profileVisible: true,
                contactsVisible: false,
                imageVisible: false
            }
        };
        result = testee.getSelectedGroups(testData, 'profileVisible');
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('Alle');
    });

    it('Getting only one Group selected', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                profileVisible: false,
                contactsVisible: false,
                imageVisible: false
            }, {
                type: 'Freund',
                profileVisible: false,
                contactsVisible: false,
                imageVisible: true
            }],
            noContact: {
                profileVisible: false,
                contactsVisible: false,
                imageVisible: false
            }
        };
        result = testee.getSelectedGroups(testData, 'imageVisible');
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('Freund');
    });

    it('Set privacy from profile visible to all only visible for Freund', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                profileVisible: true,
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }, {
                type: 'Freund',
                profileVisible: true,
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
        }, selectedProfileVisible = ['Freund'];
        result = testee.setPrivacySettingProfileVisible(testData, selectedProfileVisible);
        expect(result.group[0].type).to.equal('Bekannter');
        expect(result.group[0].profileVisible).to.equal(false);
        expect(result.group[0].contactsVisible).to.equal(false);
        expect(result.group[0].imageVisible).to.equal(false);
        expect(result.group[0].pinwallVisible).to.equal(false);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].profileVisible).to.equal(true);
        expect(result.group[1].contactsVisible).to.equal(true);
        expect(result.group[1].imageVisible).to.equal(true);
        expect(result.group[1].pinwallVisible).to.equal(true);

        expect(result.noContact.profileVisible).to.equal(false);
        expect(result.noContact.contactsVisible).to.equal(false);
        expect(result.noContact.imageVisible).to.equal(false);
        expect(result.noContact.pinwallVisible).to.equal(false);
    });

    it('Set privacy from profile visible only for Freund to visible for all', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                profileVisible: false,
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }, {
                type: 'Freund',
                profileVisible: true,
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
        expect(result.group[0].profileVisible).to.equal(true);
        expect(result.group[0].contactsVisible).to.equal(false);
        expect(result.group[0].imageVisible).to.equal(false);
        expect(result.group[0].pinwallVisible).to.equal(false);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].profileVisible).to.equal(true);
        expect(result.group[1].contactsVisible).to.equal(false);
        expect(result.group[1].imageVisible).to.equal(true);
        expect(result.group[1].pinwallVisible).to.equal(true);

        expect(result.noContact.profileVisible).to.equal(true);
        expect(result.noContact.contactsVisible).to.equal(false);
        expect(result.noContact.imageVisible).to.equal(false);
        expect(result.noContact.pinwallVisible).to.equal(false);
    });

    it('Set privacy from profile visible only for Freund and Bekannter to visible for all', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                profileVisible: true,
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: false
            }, {
                type: 'Freund',
                profileVisible: true,
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
        expect(result.group[0].profileVisible).to.equal(true);
        expect(result.group[0].contactsVisible).to.equal(false);
        expect(result.group[0].imageVisible).to.equal(true);
        expect(result.group[0].pinwallVisible).to.equal(false);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].profileVisible).to.equal(true);
        expect(result.group[1].contactsVisible).to.equal(false);
        expect(result.group[1].imageVisible).to.equal(true);
        expect(result.group[1].pinwallVisible).to.equal(true);

        expect(result.noContact.profileVisible).to.equal(true);
        expect(result.noContact.contactsVisible).to.equal(false);
        expect(result.noContact.imageVisible).to.equal(true);
        expect(result.noContact.pinwallVisible).to.equal(false);
    });

    it('Set a privacy property from all to only Freund', function () {
        var result, testData = {
            group: [{
                type: 'Bekannter',
                profileVisible: true,
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }, {
                type: 'Freund',
                profileVisible: true,
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
        expect(result.group[0].profileVisible).to.equal(true);
        expect(result.group[0].contactsVisible).to.equal(false);
        expect(result.group[0].imageVisible).to.equal(true);
        expect(result.group[0].pinwallVisible).to.equal(true);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].profileVisible).to.equal(true);
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
                profileVisible: true,
                contactsVisible: false,
                imageVisible: true,
                pinwallVisible: true
            }, {
                type: 'Freund',
                profileVisible: true,
                contactsVisible: true,
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
        expect(result.group[0].profileVisible).to.equal(true);
        expect(result.group[0].contactsVisible).to.equal(true);
        expect(result.group[0].imageVisible).to.equal(true);
        expect(result.group[0].pinwallVisible).to.equal(true);

        expect(result.group[1].type).to.equal('Freund');
        expect(result.group[1].profileVisible).to.equal(true);
        expect(result.group[1].contactsVisible).to.equal(true);
        expect(result.group[1].imageVisible).to.equal(false);
        expect(result.group[1].pinwallVisible).to.equal(false);

        expect(result.noContact.profileVisible).to.equal(true);
        expect(result.noContact.contactsVisible).to.equal(true);
        expect(result.noContact.imageVisible).to.equal(false);
        expect(result.noContact.pinwallVisible).to.equal(false);
    });

    it('Set a privacy property Freund and Alle disabled', function () {
        var testData = {
            group: [{
                type: 'Bekannter',
                profileVisible: true,
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }, {
                type: 'Freund',
                profileVisible: false,
                contactsVisible: true,
                imageVisible: true,
                pinwallVisible: true
            }],
            noContact: {
                profileVisible: false,
                contactsVisible: false,
                imageVisible: false,
                pinwallVisible: false
            }
        }, groupNames = [{type: 'Alle'}, {type: 'Bekannter'}, {type: 'Freund'}];

        testee.setDisabled(testData, groupNames);

        expect(groupNames[0].disabled).to.equal(true);
        expect(groupNames[1].disabled).to.equal(false);
        expect(groupNames[2].disabled).to.equal(true);
    });
});
