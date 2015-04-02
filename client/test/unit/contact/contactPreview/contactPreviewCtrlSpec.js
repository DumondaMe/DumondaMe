'use strict';

var contactPreviewCtrl = require('../../../../app/modules/contact/contactPreview/contactPreviewCtrl').directiveCtrl()[3];

describe('Tests of Contact Preview Controller', function () {
    var scope, state, ContactUserActions;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            ContactUserActions = {};
            ContactUserActions.setConnectionState = function () {
            };
            ContactUserActions.setPrivacySettings = function () {
            };

            state = {};
            state.go = function () {
            };


            scope = $rootScope.$new();
            done();
        });
    });

    it('Open the contact detail page', function () {

        var spyGo = sinon.stub(state, 'go');

        scope.contact = {id: '5'};

        contactPreviewCtrl(scope, state, ContactUserActions);
        scope.openUserDetails();

        expect(spyGo.calledOnce).to.be.true;
        expect(spyGo.getCall(0).args[0]).to.equals('contact.detail');
        expect(spyGo.getCall(0).args[1].userId).to.equals('5');
    });
});
