'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let moment = require('moment');
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting page events', function () {

    let startTime;

    beforeEach(function () {
        return dbDsl.init(2).then(function () {
            startTime = Math.floor(moment.utc().valueOf() / 1000);
            dbDsl.createGenericPage('1', '2', ['en', 'de'], ['environmental', 'spiritual'], 100, 'Test1Place', [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '11'
            }]);
            dbDsl.createGenericPage('2', '2', ['en', 'de'], ['environmental', 'spiritual'], 100, 'Test1Place', [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '12'
            }]);
            dbDsl.createPageEventNewAddress('1', {
                eventId: '1', title: 'Event', description: 'Super Event',
                startDate: startTime - 2, endDate: startTime + 600
            }, {addressId: '13', description: 'Urdorf', lat: 48.05642, lng: 8.36542});
            dbDsl.createPageEventNewAddress('1', {
                eventId: '2', title: 'Event2', description: 'Super Event2',
                startDate: startTime + 550, endDate: startTime + 601
            }, {addressId: '14', description: 'Urdorf2', lat: 48.05642, lng: 8.36542});
            dbDsl.createPageEventNewAddress('2', {
                eventId: '3', title: 'Event3', description: 'Super Event3',
                startDate: startTime + 550, endDate: startTime + 602
            }, {addressId: '15', description: 'Urdorf3', lat: 48.05642, lng: 8.36542});
            dbDsl.createPageEventNewAddress('2', {
                eventId: '13', title: 'Event13', description: 'Super Event13',
                startDate: startTime - 500, endDate: startTime - 603
            }, {addressId: '16', description: 'Urdorf13', lat: 48.05642, lng: 8.36542});
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting actual events of a page - Return 200', function () {

        dbDsl.createPageEventExistingAddress('1', {
            eventId: '4', title: 'Event4', description: 'Super Event4',
            startDate: startTime + 560, endDate: startTime + 600
        }, '11');
        dbDsl.createPageEventExistingAddress('1', {
            eventId: '5', title: 'Event5', description: 'Super Event5',
            startDate: startTime - 500, endDate: startTime - 400
        }, '11');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/page/event/overview', {
                skip: 0,
                maxItems: 2,
                actual: true,
                pageId: '1'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.events.length.should.equals(2);
            res.body.events[0].eventId.should.equals('1');
            res.body.events[0].title.should.equals('Event');
            res.body.events[0].startDate.should.equals(startTime - 2);
            res.body.events[0].endDate.should.equals(startTime + 600);
            res.body.events[0].where.should.equals('Urdorf');

            res.body.events[1].eventId.should.equals('2');
            res.body.events[1].title.should.equals('Event2');
            res.body.events[1].startDate.should.equals(startTime + 550);
            res.body.events[1].endDate.should.equals(startTime + 601);
            res.body.events[1].where.should.equals('Urdorf2');

            res.body.totalNumberOfEvents.should.equals(3);
        });
    });

    it('Getting past events of a page - Return 200', function () {

        dbDsl.createPageEventExistingAddress('1', {
            eventId: '4', title: 'Event4', description: 'Super Event4',
            startDate: startTime - 540, endDate: startTime - 402
        }, '11');
        dbDsl.createPageEventExistingAddress('1', {
            eventId: '5', title: 'Event5', description: 'Super Event5',
            startDate: startTime - 550, endDate: startTime - 401
        }, '11');
        dbDsl.createPageEventExistingAddress('1', {
            eventId: '6', title: 'Event6', description: 'Super Event6',
            startDate: startTime - 560, endDate: startTime - 400
        }, '11');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            return requestHandler.getWithData('/api/page/event/overview', {
                skip: 0,
                maxItems: 2,
                actual: false,
                pageId: '1'
            }, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.events.length.should.equals(2);
            res.body.events[0].eventId.should.equals('6');
            res.body.events[0].title.should.equals('Event6');
            res.body.events[0].startDate.should.equals(startTime - 560);
            res.body.events[0].endDate.should.equals(startTime - 400);
            res.body.events[0].where.should.equals('Zuerich');

            res.body.events[1].eventId.should.equals('5');
            res.body.events[1].title.should.equals('Event5');
            res.body.events[1].startDate.should.equals(startTime - 550);
            res.body.events[1].endDate.should.equals(startTime - 401);
            res.body.events[1].where.should.equals('Zuerich');

            res.body.totalNumberOfEvents.should.equals(3);
        });
    });
});
