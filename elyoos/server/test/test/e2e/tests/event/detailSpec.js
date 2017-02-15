'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for getting event detail', function () {

    let requestAgent, startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(2).then(function () {

            dbDsl.createGenericPage('0', {adminId: '1', language: ['de'], topic: ['health', 'personalDevelopment'], created: 100}, [{
                address: 'Zuerich',
                description: 'ZuerichDescription',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }]);
            dbDsl.createGenericPage('1', {adminId: '2', language: ['en'], topic: ['health', 'spiritual'], created: 100}, [{
                address: 'Zuerich1',
                lat: 47.37,
                lng: 8.54,
                addressId: '2'
            }]);
            dbDsl.createPageEventExistingAddress('0', {
                eventId: '10', title: 'Event1', description: 'Super Event1', linkDescription: 'www.link.org',
                startDate: startTime + 300, endDate: startTime + 550
            }, '1');
            dbDsl.createPageEventExistingAddress('0', {
                eventId: '11', title: 'Event2', description: 'Super Event2',
                startDate: startTime + 400, endDate: startTime + 550
            }, '1');
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting event detail', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/event/detail', {
                eventId: '10'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.eventId.should.equals('10');
            res.body.pageId.should.equals('0');
            res.body.pageTitle.should.equals('generic0Title');
            res.body.title.should.equals('Event1');
            res.body.description.should.equals('Super Event1');
            res.body.linkDescription.should.equals('www.link.org');
            res.body.address.should.equals('Zuerich');
            res.body.addressDescription.should.equals('ZuerichDescription');
            res.body.startDate.should.equals(startTime + 300);
            res.body.endDate.should.equals(startTime + 550);

        });
    });

    it('Event does not exist', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/event/detail', {
                eventId: '100'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
