'use strict';

var contactPreviewCtrl = require('../../../../app/modules/contact/contactPreview/contactPreviewCtrl')[2];
var underscore = require('../../../../app/lib/underscore/underscore');

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

    it('Get connection state image url when user and contact have connections to each other', function () {

        scope.contact = {connected: 'both'};

        contactPreviewCtrl(scope, Contact);

        expect(scope.getConnectionState()).to.equal("app/img/bothContact.png");
    });

    it('Get connection state image url when only user has connection to contact', function () {

        scope.contact = {connected: 'userToContact'};

        contactPreviewCtrl(scope, Contact);

        expect(scope.getConnectionState()).to.equal("app/img/userToContact.png");
    });

    it('Get connection state image url when only contact has connection to user', function () {

        scope.contact = {connected: 'contactToUser'};

        contactPreviewCtrl(scope, Contact);

        expect(scope.getConnectionState()).to.equal("app/img/contactToUser.png");
    });

    it('Get no connection state iImage url when no connection has been made', function () {

        scope.contact = {connected: 'none'};

        contactPreviewCtrl(scope, Contact);

        expect(scope.getConnectionState()).to.equal("#");
    });

    it('Connection state image is not shown when no connection has been made', function () {

        scope.contact = {connected: 'none'};

        contactPreviewCtrl(scope, Contact);

        expect(scope.showConnectionState()).to.be.false;
    });

    it('Connection state image is shown when a connection has been made', function () {

        scope.contact = {connected: 'contactToUser'};

        contactPreviewCtrl(scope, Contact);

        expect(scope.showConnectionState()).to.be.true;
        scope.contact.connected = 'userToContact';
        expect(scope.showConnectionState()).to.be.true;
        scope.contact.connected = 'both';
        expect(scope.showConnectionState()).to.be.true;
    });
});
