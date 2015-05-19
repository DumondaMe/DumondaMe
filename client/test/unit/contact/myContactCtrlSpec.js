'use strict';

var myContactCtrl = require('../../../app/modules/contact/myContactCtrl')[4];

describe('Tests of My Contact Controller', function () {
    var scope, Contact, SearchUsers, ContactLeftNavElements;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Contact = {};
            Contact.get = function () {
            };

            SearchUsers = {};
            SearchUsers.query = function () {
            };

            ContactLeftNavElements = {};

            scope = $rootScope.$new();
            done();
        });
    });

    it('Successful getting all contacts of the user for the first pagination', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    type: 'Bekannter',
                    name: 'Hans2 Muster2'
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);
        scope.getContacts(1);
        stubContactGet.callArg(1);

        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
    });

    it('Successful getting all contacts of the user for the second pagination', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    type: 'Bekannter',
                    name: 'Hans2 Muster2'
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 30}).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);
        scope.getContacts(2);
        stubContactGet.callsArg(1);

        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
    });

    it('Getting a user suggestion', function () {

        var mockSearchUser = sinon.mock(SearchUsers),
            searchQuery = 'R';

        mockSearchUser.expects('query').withArgs({
            search: searchQuery,
            maxItems: 7,
            isSuggestion: true
        }).returns({$promise: 1});

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);
        scope.getUserSuggestion(searchQuery);

        mockSearchUser.verify();
    });

    it('If search user is undefined then get all contacts', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            mockSearchUser = sinon.mock(SearchUsers),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    type: 'Bekannter',
                    name: 'Hans2 Muster2'
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);
        mockSearchUser.expects('query').never();

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);
        scope.getUserSuggestion();
        stubContactGet.callArg(1);

        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
        mockSearchUser.verify();
    });

    it('If search user for suggestion is empty then get all contacts', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            mockSearchUser = sinon.mock(SearchUsers),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    type: 'Bekannter',
                    name: 'Hans2 Muster2'
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);
        mockSearchUser.expects('query').never();

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);
        scope.getUserSuggestion('   ');
        stubContactGet.callArg(1);

        mockSearchUser.verify();
        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
    });

    it('Query a User on the server', function () {

        var stubSearchUser = sinon.stub(SearchUsers, 'query'),
            search = 'Hans',
            response = [{
                id: '1',
                type: 'Freund',
                name: 'Hans Muster'
            }];

        stubSearchUser.withArgs({
            search: search,
            maxItems: 20,
            isSuggestion: false
        }).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);

        scope.users = {};
        scope.users.statistic = [{
            type: 'Freund',
            count: 20,
            selected: true
        }];

        scope.getUser(search);
        stubSearchUser.callArg(1);

        expect(scope.users.contacts.length).to.equal(1);
        expect(scope.users.contacts[0].id).to.equal('1');
        expect(scope.allContactsSelected).to.be.false;
        expect(scope.isUserSearch).to.be.true;
        expect(scope.users.statistic[0].selected).to.be.false;
    });

    it('If search user is empty then get all contacts', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            mockSearchUser = sinon.mock(SearchUsers),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    type: 'Bekannter',
                    name: 'Hans2 Muster2'
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);
        mockSearchUser.expects('query').never();

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);
        scope.getUser('   ');
        stubContactGet.callArg(1);

        mockSearchUser.verify();
        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
    });

    it('Selecting all contacts', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    type: 'Bekannter',
                    name: 'Hans2 Muster2'
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);
        scope.selectedAllContacts();
        stubContactGet.callArg(1);

        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
    });

    it('Selecting two type of contacts', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }, {
                    id: '2',
                    type: 'Bekannter',
                    name: 'Hans2 Muster2'
                }],
                contactsForPagination: 2
            };

        stubContactGet.withArgs({
            itemsPerPage: 30,
            skip: 0,
            types: 'Freund,Bekannter'
        }).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);

        scope.users = {};
        scope.users.statistic = [
            {type: 'Freund', selected: false},
            {type: 'Bekannter', selected: true}
        ];

        scope.selectedStatisticType(scope.users.statistic[0]);
        stubContactGet.callArg(1);

        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.users.contactsForPagination).to.equal(2);
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
    });

    it('Deselect type of contacts', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }],
                contactsForPagination: 1
            };

        stubContactGet.withArgs({
            itemsPerPage: 30,
            skip: 0,
            types: 'Bekannter'
        }).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);

        scope.users = {};
        scope.users.statistic = [
            {type: 'Freund', selected: true},
            {type: 'Bekannter', selected: true}
        ];

        scope.selectedStatisticType(scope.users.statistic[0]);
        stubContactGet.callArg(1);

        expect(scope.users.contacts.length).to.equal(1);
        expect(scope.users.contactsForPagination).to.equal(1);
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
    });

    it('If all types of contact deselected then getting all contacts', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }]
            };

        stubContactGet.withArgs({
            itemsPerPage: 30,
            skip: 0
        }).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);

        scope.users = {};
        scope.users.statistic = [
            {type: 'Freund', selected: true},
            {type: 'Bekannter', selected: false}
        ];

        scope.selectedStatisticType(scope.users.statistic[0]);
        stubContactGet.callArg(1);

        expect(scope.users.contacts.length).to.equal(1);
        expect(scope.isUserSearch).to.be.false;
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.users.contacts[0].type).to.equal('Freund');
    });

    it('Pagination number changes when all contacts selected', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }]
            };

        scope.allContactsSelected = true;

        stubContactGet.withArgs({
            itemsPerPage: 30,
            skip: 30
        }).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);

        scope.users = {};
        scope.users.statistic = [
            {type: 'Freund', selected: false},
            {type: 'Bekannter', selected: false}
        ];

        scope.paginationChanged(2);
        stubContactGet.callArg(1);

        expect(scope.users.contacts.length).to.equal(1);
        expect(scope.isUserSearch).to.be.false;
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.users.contacts[0].type).to.equal('Freund');
    });

    it('Pagination number changes when type of contact is selected', function () {

        var stubContactGet = sinon.stub(Contact, 'get'),
            response = {
                contacts: [{
                    id: '1',
                    type: 'Freund',
                    name: 'Hans Muster'
                }],
                contactsForPagination: 1
            };

        stubContactGet.withArgs({
            itemsPerPage: 30,
            skip: 30,
            types: 'Freund'
        }).returns(response);

        myContactCtrl(scope, SearchUsers, Contact, ContactLeftNavElements);
        scope.users = {};
        scope.users.statistic = [
            {type: 'Freund', selected: true},
            {type: 'Bekannter', selected: false}
        ];
        scope.allContactsSelected = false;
        scope.paginationChanged(2);
        stubContactGet.callArg(1);

        expect(scope.users.contacts.length).to.equal(1);
        expect(scope.users.contactsForPagination).to.equal(1);
        expect(scope.users.contacts[0].type).to.equal('Freund');
    });
});