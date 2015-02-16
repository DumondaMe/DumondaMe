'use strict';

var privacyCtrl = require('../../../app/modules/settings/renamePrivacyCtrl')[2];

describe('Tests of rename privacy controller', function () {
    var scope, Privacy;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();

            Privacy = {};
            Privacy.save = function () {
            };
            done();
        });
    });

    it('Check if the privacy already exists returns no equal privacy setting', function () {

        scope.privacySettings = {};
        scope.privacy = {};
        scope.privacy.type = 'Irgendwas';
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

        scope.$digest();

        expect(scope.renameExists).to.be.false;
    });

    it('Check if the privacy already exists returns equal privacy setting', function () {

        scope.privacySettings = {};
        scope.privacy = {};
        scope.privacy.type = 'Familie';
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

        scope.$digest();

        expect(scope.renameExists).to.be.true;
    });

    it('Rename a privacy setting', function () {

        var stubSavePrivacy = sinon.stub(Privacy, 'save');
        scope.privacySettings = {};
        scope.privacy = {};
        scope.privacy.type = 'Familie';
        scope.selectedType = {};
        scope.selectedType.type = 'Familie';

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

        scope.renameType = 'Fami';
        scope.renamePrivacySetting();

        stubSavePrivacy.callArg(1);

        expect(scope.privacySettings.normal[1].type).to.equals('Fami');
        expect(scope.selectedType.type).to.equals('Fami');
        expect(scope.privacy.type).to.equals('Fami');
    });
});
