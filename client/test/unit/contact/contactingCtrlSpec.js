'use strict';

var contactingCtrl = require('../../../app/modules/contact/contactingCtrl')[2];
var moment = require('../../../app/lib/moment/moment');

describe('Tests of contacting controller', function () {
    var scope, Contacting;

    beforeEach(function (done) {
        inject(function ($rootScope) {

            Contacting = {};
            Contacting.get = function () {
            };

            scope = $rootScope.$new();
            done();
        });
    });

    it('Successful getting all contactings of the user for the first pagination', function () {

        var stubContactGet = sinon.stub(Contacting, 'get'),
            response = {
                contactingUsers: [{
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

        contactingCtrl(scope, Contacting);
        stubContactGet.callArg(1);

        expect(scope.users.contactingUsers.length).to.equal(2);
        expect(scope.users.contactingUsers[0].type).to.equal('Freund');
        expect(scope.users.contactingUsers[1].type).to.equal('Bekannter');
    });

    it('Return if the transitions day to week to month to later shall be displayed', function () {

        var stubContactGet = sinon.stub(Contacting, 'get'),
            now = Math.floor(moment.utc().valueOf() / 1000),
            response = {
                contactingUsers: [{
                    userAdded: now - 1000
                }, {
                    userAdded: now - 86300
                }, {
                    userAdded: now - 86500
                }, {
                    userAdded: now - 604700
                }, {
                    userAdded: now - 604900
                }, {
                    userAdded: now - 2591000
                }, {
                    userAdded: now - 2593000
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);

        contactingCtrl(scope, Contacting);
        stubContactGet.callArg(1);

        expect(scope.users.contactingUsers.length).to.equal(7);
        expect(scope.showContactingInfo(0)).to.be.true;
        expect(scope.showContactingInfo(1)).to.be.false;
        expect(scope.showContactingInfo(2)).to.be.true;
        expect(scope.showContactingInfo(3)).to.be.false;
        expect(scope.showContactingInfo(4)).to.be.true;
        expect(scope.showContactingInfo(5)).to.be.false;
        expect(scope.showContactingInfo(6)).to.be.true;
    });

    it('Return if the transitions day to week shall be displayed when no previous day is available', function () {

        var stubContactGet = sinon.stub(Contacting, 'get'),
            now = Math.floor(moment.utc().valueOf() / 1000),
            response = {
                contactingUsers: [{
                    userAdded: now - 86500
                }, {
                    userAdded: now - 604700
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);

        contactingCtrl(scope, Contacting);
        stubContactGet.callArg(1);

        expect(scope.users.contactingUsers.length).to.equal(2);
        expect(scope.showContactingInfo(0)).to.be.true;
        expect(scope.showContactingInfo(1)).to.be.false;
    });

    it('Return if the transitions week to month shall be displayed when no previous day and week is available', function () {

        var stubContactGet = sinon.stub(Contacting, 'get'),
            now = Math.floor(moment.utc().valueOf() / 1000),
            response = {
                contactingUsers: [{
                    userAdded: now - 604900
                }, {
                    userAdded: now - 2591000
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);

        contactingCtrl(scope, Contacting);
        stubContactGet.callArg(1);

        expect(scope.users.contactingUsers.length).to.equal(2);
        expect(scope.showContactingInfo(0)).to.be.true;
        expect(scope.showContactingInfo(1)).to.be.false;
    });

    it('Return if the transitions month to later shall be displayed when no previous day and week and month is available', function () {

        var stubContactGet = sinon.stub(Contacting, 'get'),
            now = Math.floor(moment.utc().valueOf() / 1000),
            response = {
                contactingUsers: [{
                    userAdded: now - 2593000
                }, {
                    userAdded: now - 2595000
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);

        contactingCtrl(scope, Contacting);
        stubContactGet.callArg(1);

        expect(scope.users.contactingUsers.length).to.equal(2);
        expect(scope.showContactingInfo(0)).to.be.true;
        expect(scope.showContactingInfo(1)).to.be.false;
    });

    it('Return the text of the transitions day to week to month', function () {

        var stubContactGet = sinon.stub(Contacting, 'get'),
            now = Math.floor(moment.utc().valueOf() / 1000),
            response = {
                contactingUsers: [{
                    userAdded: now - 1000
                }, {
                    userAdded: now - 86300
                }, {
                    userAdded: now - 86500
                }, {
                    userAdded: now - 604700
                }, {
                    userAdded: now - 604900
                }, {
                    userAdded: now - 2591000
                }, {
                    userAdded: now - 2593000
                }]
            };

        stubContactGet.withArgs({itemsPerPage: 30, skip: 0}).returns(response);

        contactingCtrl(scope, Contacting);
        stubContactGet.callArg(1);

        expect(scope.users.contactingUsers.length).to.equal(7);
        expect(scope.getContactingInfo(0)).to.exist;
        expect(scope.getContactingInfo(1)).to.not.exist;
        expect(scope.getContactingInfo(2)).to.exist;
        expect(scope.getContactingInfo(3)).to.not.exist;
        expect(scope.getContactingInfo(4)).to.exist;
        expect(scope.getContactingInfo(5)).to.not.exist;
        expect(scope.getContactingInfo(6)).to.exist;
    });
});