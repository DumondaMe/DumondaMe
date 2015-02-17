'use strict';

var deletePrivacyCtrl = require('../../../app/modules/settings/deletePrivacyCtrl')[2];

describe('Tests of delete privacy controller', function () {
    var scope, Privacy;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            scope = $rootScope.$new();
            scope.setPrivacyTypeNoContact = function () {
            };

            Privacy = {};
            Privacy.delete = function () {
            };
            done();
        });
    });

    it('Only privacy settings other then the setting do delete are listed for moving the contacts to', function () {

        scope.privacySettings = {};
        scope.privacy = {};
        scope.privacy.type = 'Familie';

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
        scope.privacySettings.normal.push({
            profileVisible: true,
            profileDataVisible: true,
            imageVisible: true,
            contactsVisible: true,
            type: 'Bekannter'
        });

        deletePrivacyCtrl(scope, Privacy);

        expect(scope.otherPrivacySettingTypes.length).to.equals(2);
        expect(scope.otherPrivacySettingTypes[0]).to.equals('Freund');
        expect(scope.otherPrivacySettingTypes[1]).to.equals('Bekannter');
        expect(scope.otherPrivacySettingType).to.equals('Freund');
    });

    it('Delete a privacy setting', function () {

        var stubDeletePrivacy = sinon.stub(Privacy, 'delete');
        scope.privacySettings = {};
        scope.privacy = {};
        scope.privacy.type = 'Familie';

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
        scope.privacySettings.normal.push({
            profileVisible: true,
            profileDataVisible: true,
            imageVisible: true,
            contactsVisible: true,
            type: 'Bekannter'
        });

        deletePrivacyCtrl(scope, Privacy);

        scope.deletePrivacySetting();

        stubDeletePrivacy.callArg(1);

        expect(scope.privacySettings.normal.length).to.equals(2);
        expect(scope.privacySettings.normal[0].type).to.equals('Freund');
        expect(scope.privacySettings.normal[1].type).to.equals('Bekannter');
    });


});
