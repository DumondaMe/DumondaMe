'use strict';

var contactPreviewCtrl = require('../../../../app/modules/contact/contactPreview/contactPreviewCtrl').directiveCtrl()[5];
var moment = require('../../../../app/lib/moment/moment');

describe('Tests of Contact Preview Controller', function () {
    var scope, state, Contact, SearchThread;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Contact = {};
            Contact.save = function () {
            };
            Contact.delete = function () {
            };

            SearchThread = {};
            SearchThread.get = function () {
            };

            state = {};
            state.go = function () {
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
        scope.numberOfContacts = 1;
        scope.contact = {id: '5'};
        scope.privacySettings = [{type: 'Freund'}, {type: 'Familie'}];

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
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
        scope.statistic = [{
            type: 'Freund',
            count: 2
        }, {
            type: 'Familie',
            count: 3
        }];
        scope.contact = {id: '5', connected: 'none'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Familie'
        }).returns(response);

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.addNewContact();
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Familie');
        expect(scope.contact.connected).to.equal('userToContact');
    });

    it('Add a new contact and update the connected state to both', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.statistic = [{
            type: 'Freund',
            count: 3
        }, {
            type: 'Familie',
            count: 2
        }];
        scope.contact = {id: '5', connected: 'contactToUser'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
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

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.contact.selectedPrivacySetting = 'Familie';
        scope.statistic = {};
        scope.sendNewDescription(function () {
        });
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

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
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

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
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

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.deleteContact();
        stubContactDelete.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.contact.connected).to.equal('none');
    });

    it('Block a contact', function () {

        var stubContactBlock = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund'};

        stubContactBlock.withArgs({mode: 'blockContact', contactIds: ['5']}).returns(response);

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.blockContact();
        stubContactBlock.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.contact.blocked).to.be.true;
        expect(scope.statistic[0]).to.equal('test');
        expect(scope.numberOfContacts).to.equal(5);
    });

    it('Unblock a contact', function () {

        var stubContactBlock = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            };

        scope.users = {};
        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund', blocked: true};

        stubContactBlock.withArgs({mode: 'unblockContact', contactIds: ['5']}).returns(response);

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.unblockContact();
        stubContactBlock.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.contact.blocked).to.be.false;
        expect(scope.statistic[0]).to.equal('test');
        expect(scope.numberOfContacts).to.equal(5);
    });

    it('Go to state to send a message to an existing thread', function () {

        var stubSearchThread = sinon.stub(SearchThread, 'get'),
            mockStateGo = sinon.mock(state).expects('go'),
            response = {
                hasExistingThread: true,
                threadId: '1'
            };

        scope.users = {};
        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund', blocked: false};

        stubSearchThread.withArgs({ userId: '5'}).returns(response);
        mockStateGo.withArgs('message.threads.detail');

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.sendMessage();
        stubSearchThread.callArg(1);

        mockStateGo.verify();
    });

    it('Go to state to create a message thread and send a message', function () {

        var stubSearchThread = sinon.stub(SearchThread, 'get'),
            mockStateGo = sinon.mock(state).expects('go'),
            response = {
                hasExistingThread: false
            };

        scope.users = {};
        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund', blocked: false};

        stubSearchThread.withArgs({ userId: '5'}).returns(response);
        mockStateGo.withArgs('message.threads.create');

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.sendMessage();
        stubSearchThread.callArg(1);

        mockStateGo.verify();
    });

    it('Get connection state image url when user and contact have connections to each other', function () {

        scope.contact = {connected: 'both'};

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.setConnectionState();

        expect(scope.contact.connectionImage).to.equal("app/img/bothContact.png");
    });

    it('Get connection state image url when only user has connection to contact', function () {

        scope.contact = {connected: 'userToContact'};

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.setConnectionState();

        expect(scope.contact.connectionImage).to.equal("app/img/userToContact.png");
    });

    it('Get connection state image url when only contact has connection to user', function () {

        scope.contact = {connected: 'contactToUser'};

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.setConnectionState();

        expect(scope.contact.connectionImage).to.equal("app/img/contactToUser.png");
    });

    it('Get no connection state iImage url when no connection has been made', function () {

        scope.contact = {connected: 'none'};

        contactPreviewCtrl(scope, state, Contact, SearchThread, moment);
        scope.setConnectionState();

        expect(scope.contact.connectionImage).to.equal("#");
    });
});
