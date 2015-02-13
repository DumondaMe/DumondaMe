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
});
