'use strict';

var myContactCtrl = require('../../../app/modules/contact/myContactCtrl')[3];

describe('Tests of My Contact Controller', function () {
    var scope, Contact, SearchUsers;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Contact = {};
            Contact.get = function () {
            };

            SearchUsers = {};
            SearchUsers.query = function () {
            };

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

        stubContactGet.withArgs({itemsPerPage: 10, skip: 0}).returns(response);

        myContactCtrl(scope, SearchUsers, Contact);
        scope.getContacts(1);
        stubContactGet.callsArg(1);

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

        stubContactGet.withArgs({itemsPerPage: 10, skip: 10}).returns(response);

        myContactCtrl(scope, SearchUsers, Contact);
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

        myContactCtrl(scope, SearchUsers, Contact);
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

        stubContactGet.withArgs({itemsPerPage: 10, skip: 0}).returns(response);
        mockSearchUser.expects('query').never();

        myContactCtrl(scope, SearchUsers, Contact);
        scope.getUserSuggestion();
        stubContactGet.callsArg(1);

        expect(scope.users.contacts.length).to.equal(2);
        expect(scope.allContactsSelected).to.be.true;
        expect(scope.isUserSearch).to.be.false;
        expect(scope.users.contacts[0].type).to.equal('Freund');
        expect(scope.users.contacts[1].type).to.equal('Bekannter');
        mockSearchUser.verify();
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

        stubContactGet.withArgs({itemsPerPage: 10, skip: 0}).returns(response);
        mockSearchUser.expects('query').never();

        myContactCtrl(scope, SearchUsers, Contact);
        scope.getUserSuggestion('   ');
        stubContactGet.callsArg(1);

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

        scope.users = {};
        scope.users.statistic = [{
            type: 'Freund',
            count: 20,
            selected: true
        }];

        stubSearchUser.withArgs({
            search: search,
            maxItems: 20,
            isSuggestion: false
        }).returns(response);

        myContactCtrl(scope, SearchUsers, Contact);
        scope.getUser(search);
        stubSearchUser.callsArg(1);

        expect(scope.users.contacts.length).to.equal(1);
        expect(scope.users.contacts[0].id).to.equal('1');
        expect(scope.allContactsSelected).to.be.false;
        expect(scope.isUserSearch).to.be.true;
        expect(scope.users.statistic[0].selected).to.be.false;
    });
});