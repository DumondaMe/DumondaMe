'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting overview events', function () {

    let requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(2).then(function () {
            dbDsl.createGenericPage('0', '1', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                address: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }]);
            dbDsl.createGenericPage('1', '2', ['en'], ['health', 'spiritual'], 100, null, [{
                address: 'Zuerich1',
                lat: 47.37,
                lng: 8.54,
                addressId: '2'
            }]);

            dbDsl.createPageEventExistingAddress('0', {
                eventId: '10', title: 'Event1', description: 'Super Event1',
                startDate: startTime + 300, endDate: startTime + 550
            }, '1');
            dbDsl.createPageEventExistingAddress('0', {
                eventId: '11', title: 'Event2', description: 'Super Event2',
                startDate: startTime + 400, endDate: startTime + 550
            }, '1');
            dbDsl.createPageEventExistingAddress('0', {
                eventId: '12', title: 'Event3', description: 'Super Event3',
                startDate: startTime - 400, endDate: startTime + 550
            }, '1');

            dbDsl.createPageEventNewAddress('1', {
                eventId: '13', title: 'Event4', description: 'Super Event4',
                startDate: startTime + 100, endDate: startTime + 600
            }, {addressId: '3', address: 'Urdorf', lat: 48.05642, lng: 8.36542});
            dbDsl.createPageEventExistingAddress('1', {
                eventId: '14', title: 'Event5', description: 'Super Event5',
                startDate: startTime + 500, endDate: startTime + 550
            }, '2');
            dbDsl.createPageEventExistingAddress('1', {
                eventId: '15', title: 'Event6', description: 'Super Event6',
                startDate: startTime + 1000, endDate: startTime + 1500
            }, '2');
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting an overview of all events', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/event/overview', {
                skip: 0,
                maxItems: 4
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.events.length.should.equals(4);
            res.body.events[0].eventId.should.equals('13');
            res.body.events[0].title.should.equals('Event4');
            res.body.events[0].address.should.equals('Urdorf');
            res.body.events[0].startDate.should.equals(startTime + 100);
            res.body.events[0].endDate.should.equals(startTime + 600);

            res.body.events[1].eventId.should.equals('10');
            res.body.events[1].title.should.equals('Event1');
            res.body.events[1].address.should.equals('Zuerich');
            res.body.events[1].startDate.should.equals(startTime + 300);
            res.body.events[1].endDate.should.equals(startTime + 550);

            res.body.events[2].eventId.should.equals('11');
            res.body.events[2].title.should.equals('Event2');
            res.body.events[2].address.should.equals('Zuerich');
            res.body.events[2].startDate.should.equals(startTime + 400);
            res.body.events[2].endDate.should.equals(startTime + 550);

            res.body.events[3].eventId.should.equals('14');
            res.body.events[3].title.should.equals('Event5');
            res.body.events[3].address.should.equals('Zuerich1');
            res.body.events[3].startDate.should.equals(startTime + 500);
            res.body.events[3].endDate.should.equals(startTime + 550);

            res.body.numberOfTotalEvents.should.equals(5);
        });
    });
});
