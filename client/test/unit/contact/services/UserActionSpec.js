'use strict';

var UserAction = require('../../../../app/modules/contact/services/userActions')[5];
var moment = require('../../../../app/lib/moment/moment');

describe('Tests of the user action to handle the contact state', function () {
    var scope, modal, state, Contact, SearchThread;

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

            modal = function () {
            };

            state = {};
            state.go = function () {
            };

            scope = $rootScope.$new();

            scope.contact = {};
            scope.tooltipConnectionState = {};
            done();
        });
    });

    it('Open modal for adding a new contact', function () {

        var modalStub = sinon.spy(), service;

        scope.statistic = [{type: 'Freund', count: 1}, {type: 'Bekannter', count: 2}];
        scope.privacySettings = [{type: 'Freund'}, {type: 'Familie'}];

        service = new UserAction(state, modalStub, SearchThread, Contact, moment);
        service.openModalAddNewContact(scope);

        expect(modalStub.called).to.be.true;
        expect(scope.contact.selectedPrivacySetting).to.equal('Bekannter');
    });

    it('Sending request to add a new contact to the contact list', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            },
            service;

        scope.numberOfContacts = 1;
        scope.contact.id = '5';
        scope.contact.selectedPrivacySetting = 'Freund';

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.addNewContact(scope, function () {
        });
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Freund');
        expect(scope.statistic[0]).to.equal('test');
        expect(scope.numberOfContacts).to.equal(5);
    });

    it('Sending request to add a new contact and update the connected state to userToContact', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            },
            service;

        scope.contact = {id: '5', connected: 'none'};
        scope.contact.selectedPrivacySetting = 'Familie';

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Familie'
        }).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.addNewContact(scope, function () {
        });
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Familie');
        expect(scope.contact.connected).to.equal('userToContact');
    });

    it('Sending a new Request and add a new contact and update the connected state to both', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            },
            service;

        scope.contact = {id: '5', connected: 'contactToUser'};
        scope.contact.selectedPrivacySetting = 'Freund';

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'addContact',
            description: 'Freund'
        }).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.addNewContact(scope, function () {
        });
        stubContactSave.callArg(1);

        expect(scope.contact.type).to.equal('Freund');
        expect(scope.contact.connected).to.equal('both');
    });

    it('Open modal to update the connection type', function () {


        var modalStub = sinon.spy(), service;

        service = new UserAction(state, modalStub, SearchThread, Contact, moment);
        service.openModalUpdateType(scope);

        expect(modalStub.called).to.be.true;
    });

    it('Sending request to update the connection type', function () {

        var stubContactSave = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test']
            },
            service;

        scope.users = {};
        scope.contact = {id: '5', connected: 'contactToUser'};

        stubContactSave.withArgs({
            contactIds: ['5'],
            mode: 'changeState',
            description: 'Familie'
        }).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        scope.contact.selectedPrivacySetting = 'Familie';
        scope.statistic = {};
        service.updateType(scope, function () {
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
            },
            service;

        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund'};

        stubContactDelete.withArgs({contactIds: ['5']}).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.deleteContact(scope);
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
            },
            service;

        scope.contact = {id: '5', type: 'Freund', connected: 'both'};

        stubContactDelete.withArgs({contactIds: ['5']}).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.deleteContact(scope);
        stubContactDelete.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.contact.connected).to.equal('contactToUser');
    });

    it('Delete and update the connected state to none', function () {

        var stubContactDelete = sinon.stub(Contact, 'delete'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            },
            service;

        scope.contact = {id: '5', type: 'Freund', connected: 'userToContact'};

        stubContactDelete.withArgs({contactIds: ['5']}).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.deleteContact(scope);
        stubContactDelete.callArg(1);

        expect(scope.contact.type).to.be.undefined;
        expect(scope.contact.connected).to.equal('none');
    });

    it('Block a contact', function () {

        var stubContactBlock = sinon.stub(Contact, 'save'),
            response = {
                statistic: ['test'],
                numberOfContacts: 5
            },
            service;

        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund'};

        stubContactBlock.withArgs({mode: 'blockContact', contactIds: ['5']}).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.blockContact(scope);
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
            },
            service;

        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund', blocked: true};

        stubContactBlock.withArgs({mode: 'unblockContact', contactIds: ['5']}).returns(response);

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.unblockContact(scope);
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
            },
            service;

        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund', blocked: false};

        stubSearchThread.withArgs({userId: '5'}).returns(response);
        mockStateGo.withArgs('message.threads.detail');

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.sendMessage('5');
        stubSearchThread.callArg(1);

        mockStateGo.verify();
    });

    it('Go to state to create a message thread and send a message', function () {

        var stubSearchThread = sinon.stub(SearchThread, 'get'),
            mockStateGo = sinon.mock(state).expects('go'),
            response = {
                hasExistingThread: false
            },
            service;

        scope.statistic = {};
        scope.numberOfContacts = 1;
        scope.contact = {id: '5', type: 'Freund', blocked: false};

        stubSearchThread.withArgs({userId: '5'}).returns(response);
        mockStateGo.withArgs('message.threads.create');

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.sendMessage('5');
        stubSearchThread.callArg(1);

        mockStateGo.verify();
    });

    it('Get connection state image url when user and contact have connections to each other', function () {

        var service;
        scope.contact = {connected: 'both'};

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.setConnectionState(scope, moment);

        expect(scope.contact.connectionImage).to.equal("app/img/bothContact.png");
    });

    it('Get connection state image url when only user has connection to contact', function () {

        var service;
        scope.contact = {connected: 'userToContact'};

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.setConnectionState(scope, moment);

        expect(scope.contact.connectionImage).to.equal("app/img/userToContact.png");
    });

    it('Get connection state image url when only contact has connection to user', function () {

        var service;
        scope.contact = {connected: 'contactToUser'};

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.setConnectionState(scope, moment);

        expect(scope.contact.connectionImage).to.equal("app/img/contactToUser.png");
    });

    it('Get no connection state iImage url when no connection has been made', function () {

        var service;
        scope.contact = {connected: 'none'};

        service = new UserAction(state, modal, SearchThread, Contact, moment);
        service.setConnectionState(scope, moment);

        expect(scope.contact.connectionImage).to.equal("#");
    });
});
