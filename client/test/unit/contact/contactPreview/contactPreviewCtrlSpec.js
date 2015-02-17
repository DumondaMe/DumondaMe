'use strict';

var contactPreviewCtrl = require('../../../../app/modules/contact/contactPreview/contactPreviewCtrl').directiveCtrl()[3];
var moment = require('../../../../app/lib/moment/moment');

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
        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        contactPreviewCtrl(scope, Contact, moment);
        scope.addNewContact();
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Freund');
        expect(scope.statistic[0]).to.equal('test');
        expect(scope.numberOfContacts).to.equal(5);
    });

    it('Add a new contact and update the connected state to userToContact', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.contact = {id: '5', connected: 'none'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        contactPreviewCtrl(scope, Contact, moment);
        scope.addNewContact();
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Freund');
        expect(scope.contact.connected).to.equal('userToContact');
    });

    it('Add a new contact and update the connected state to both', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.contact = {id: '5', connected: 'contactToUser'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        contactPreviewCtrl(scope, Contact, moment);
        scope.addNewContact();
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Freund');
        expect(scope.contact.connected).to.equal('both');
    });

    it('Add a new contact and update the connected state to both', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.contact = {id: '5', connected: 'contactToUser'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        contactPreviewCtrl(scope, Contact, moment);
        scope.addNewContact();
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Freund');
        expect(scope.contact.connected).to.equal('both');
    });

    it('Update the connection type', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test']
            };

        scope.users = {};
        scope.contact = {id: '5', connected: 'contactToUser'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'changeState',
            description: 'Familie'
        }).returns(response);

        contactPreviewCtrl(scope, Contact, moment);
        scope.contact.selectedPrivacySetting = 'Familie';
        scope.statistic = {};
        scope.sendNewDescription();
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Familie');
        expect(scope.statistic).to.eql(response.statistic);
        expect(scope.contact.connected).to.equal('contactToUser');
    });

    it('Delete a new contact form contact list', function () {

        var stubContactDelete = sinon.stub(Contact, 'delete'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund'};

        stubContactDelete.withArgs({contactIds: ['5']}).returns(response);

        contactPreviewCtrl(scope, Contact, moment);
        scope.deleteContact();
        stubContactDelete.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.statistic[0]).to.equal('test');
        expect(scope.numberOfContacts).to.equal(5);
    });

    it('Delete and update the connected state to contactToUser', function () {

        var stubContactDelete = sinon.stub(Contact, 'delete'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};

        scope.contact = {id: '5', type: 'Freund', connected: 'both'};

        stubContactDelete.withArgs({contactIds: ['5']}).returns(response);

        contactPreviewCtrl(scope, Contact, moment);
        scope.deleteContact();
        stubContactDelete.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.contact.connected).to.equal('contactToUser');
    });

    it('Delete and update the connected state to none', function () {

        var stubContactDelete = sinon.stub(Contact, 'delete'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};

        scope.contact = {id: '5', type: 'Freund', connected: 'userToContact'};

        stubContactDelete.withArgs({contactIds: ['5']}).returns(response);

        contactPreviewCtrl(scope, Contact, moment);
        scope.deleteContact();
        stubContactDelete.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.contact.connected).to.equal('none');
    });

    it('If Contact blocked mark as blocked', function () {

        scope.contact = {blocked: true};

        contactPreviewCtrl(scope, Contact, moment);

        expect(scope.contact.actions[3].text).to.equal("Blockierung aufheben");
    });

    it('Get connection state image url when user and contact have connections to each other', function () {

        scope.contact = {connected: 'both'};

        contactPreviewCtrl(scope, Contact, moment);
        scope.setConnectionState();

        expect(scope.contact.connectionImage).to.equal("app/img/bothContact.png");
    });

    it('Get connection state image url when only user has connection to contact', function () {

        scope.contact = {connected: 'userToContact'};

        contactPreviewCtrl(scope, Contact, moment);
        scope.setConnectionState();

        expect(scope.contact.connectionImage).to.equal("app/img/userToContact.png");
    });

    it('Get connection state image url when only contact has connection to user', function () {

        scope.contact = {connected: 'contactToUser'};

        contactPreviewCtrl(scope, Contact, moment);
        scope.setConnectionState();

        expect(scope.contact.connectionImage).to.equal("app/img/contactToUser.png");
    });

    it('Get no connection state iImage url when no connection has been made', function () {

        scope.contact = {connected: 'none'};

        contactPreviewCtrl(scope, Contact, moment);
        scope.setConnectionState();

        expect(scope.contact.connectionImage).to.equal("#");
    });
});
