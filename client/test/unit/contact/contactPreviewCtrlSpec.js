'use strict';

var contactPreviewCtrl = require('../../../app/modules/contact/contactPreviewCtrl')[2];
var underscore = require('../../../app/lib/underscore/underscore');

describe('Tests of Contact Preview Controller', function () {
    var scope, Contact;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Contact = {};
            Contact.save = function () {
            };
            Contact.delete = function () {
            };

            scope = $rootScope.$new();
            done();
        });
    });

    it('Add a new contact to contact list', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.contact = {id: '5'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        contactPreviewCtrl(scope, Contact);
        scope.addNewContact();
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Freund');
        expect(scope.users.statistic[0]).to.equal('test');
        expect(scope.users.numberOfContacts).to.equal(5);
    });

    it('Delete a new contact to contact list', function () {

        var stubContactDelete = sinon.stub(Contact, 'delete'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.contact = {id: '5', type: 'Freund'};

        stubContactDelete.withArgs({contactIds: ['5']}).returns(response);

        contactPreviewCtrl(scope, Contact);
        scope.deleteContact();
        stubContactDelete.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.users.statistic[0]).to.equal('test');
        expect(scope.users.numberOfContacts).to.equal(5);
    });

    it('If Contact blocked mark as blocked', function () {

        scope.contact = {blocked: true};

        contactPreviewCtrl(scope, Contact);

        expect(scope.contact.actions[3].text).to.equal("Blockierung aufheben");
    });
});
