'use strict';

var privacyCtrl = require('../../../app/modules/settings/privacyCtrl')[2];

describe('Tests of Privacy Controller', function () {
    var scope, Privacy;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();

            Privacy = {};
            Privacy.get = function () {
            };
            Privacy.save = function () {
            };
            done();
        });
    });

    it('Successful getting privacy settings from the server', function () {

        var privacySettings = {
                normal: [{
                    type: 'Familie'
                }],
                noContact: {}
            },
            stubPrivacy = sinon.stub(Privacy, 'get');
        stubPrivacy.returns(privacySettings);

        privacyCtrl(scope, Privacy);

        stubPrivacy.callArgWith(1, privacySettings);

        expect(scope.privacySettings.noContactSelected).to.be.true;
        expect(scope.selectedType.type).to.equals('kein Kontakt');
    });

    it('Selecting a type', function () {

        var privacySettings = {
                normal: [{
                    type: 'Freund',
                    test: 'SomeValue2'
                },
                    {
                        type: 'Familie',
                        test: 'SomeValue'
                    }],
                noContact: {}
            },
            stubPrivacy = sinon.stub(Privacy, 'get');
        stubPrivacy.returns(privacySettings);

        privacyCtrl(scope, Privacy);

        stubPrivacy.callArgWith(1, privacySettings);
        scope.setPrivacyType('Familie');
        scope.$digest();

        expect(scope.disableChangePrivacy).to.be.true;
        expect(scope.privacySettings.noContactSelected).to.be.false;
        expect(scope.selectedType.type).to.equals(privacySettings.normal[1].type);
        expect(scope.selectedType.test).to.equals(privacySettings.normal[1].test);
    });

    it('Change the settings of a type', function () {

        var privacySettings = {
                normal: [{
                    type: 'Freund',
                    test: 'SomeValue2'
                },
                    {
                        type: 'Familie',
                        test: 'SomeValue'
                    }],
                noContact: {}
            },
            stubPrivacy = sinon.stub(Privacy, 'get');
        stubPrivacy.returns(privacySettings);

        privacyCtrl(scope, Privacy);

        stubPrivacy.callArgWith(1, privacySettings);
        scope.setPrivacyType('Familie');
        scope.$digest();
        scope.selectedType.test = 'SomethingElse';
        scope.$digest();

        expect(scope.disableChangePrivacy).to.be.false;
    });

    it('Update the privacy settings for no contact', function () {

        var stubSavePrivacy = sinon.stub(Privacy, 'save'),
            stubGetPrivacy = sinon.stub(Privacy, 'get');
        stubGetPrivacy.returns({});

        privacyCtrl(scope, Privacy);

        scope.privacySettings.noContact = {};
        scope.privacySettings.noContact.profileVisible = true;
        scope.privacySettings.noContact.profileDataVisible = true;
        scope.privacySettings.noContact.imageVisible = true;
        scope.privacySettings.noContact.contactsVisible = true;

        scope.setPrivacyTypeNoContact();
        scope.selectedType.profileVisible = false;
        scope.selectedType.profileDataVisible = false;
        scope.selectedType.imageVisible = false;
        scope.selectedType.contactsVisible = false;

        scope.$digest();
        scope.updatePrivacyType();

        stubSavePrivacy.callArg(1);

        expect(scope.privacySettings.noContact.profileVisible).to.be.false;
        expect(scope.privacySettings.noContact.profileDataVisible).to.be.false;
        expect(scope.privacySettings.noContact.imageVisible).to.be.false;
        expect(scope.privacySettings.noContact.contactsVisible).to.be.false;
        expect(scope.disableChangePrivacy).to.be.true;
    });

    it('Update the privacy settings for a contact type', function () {

        var stubSavePrivacy = sinon.stub(Privacy, 'save'),
            stubGetPrivacy = sinon.stub(Privacy, 'get');
        stubGetPrivacy.returns({});

        privacyCtrl(scope, Privacy);

        scope.privacySettings.normal = [];
        scope.privacySettings.normal.push({
            profileVisible: true,
            profileDataVisible: true,
            imageVisible: true,
            contactsVisible: true,
            type: 'Freund'
        });
        scope.privacySettings.normal.push({
            profileVisible: true,
            profileDataVisible: true,
            imageVisible: true,
            contactsVisible: true,
            type: 'Familie'
        });

        scope.setPrivacyType('Familie');
        scope.selectedType.profileVisible = false;
        scope.selectedType.profileDataVisible = false;
        scope.selectedType.imageVisible = false;
        scope.selectedType.contactsVisible = false;

        scope.$digest();
        scope.updatePrivacyType();

        stubSavePrivacy.callArg(1);

        expect(scope.privacySettings.normal[1].profileVisible).to.be.false;
        expect(scope.privacySettings.normal[1].profileDataVisible).to.be.false;
        expect(scope.privacySettings.normal[1].imageVisible).to.be.false;
        expect(scope.privacySettings.normal[1].contactsVisible).to.be.false;
        expect(scope.disableChangePrivacy).to.be.true;
    });
});
