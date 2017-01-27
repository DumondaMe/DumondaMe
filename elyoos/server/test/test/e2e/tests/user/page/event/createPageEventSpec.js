'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let should = require('chai').should();
let stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Integration Tests for creating new events for generic pages', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        stubCDN.uploadFile.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(5).then(function () {
            dbDsl.createGenericPage('1', '1', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }]);
            dbDsl.createGenericPage('2', '2', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '2'
            }]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new event - Return 200', function () {

        let createEvent = {
            title: 'title',
            description: 'description',
            genericPageId: '1',
            startDate: startTime + 500,
            endDate: startTime + 600,
            address: {description: 'Zuerich', lat: 47.376887, lng: 8.541694}
        }, eventId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            eventId = res.body.eventId;
            return db.cypher().match("(address:Address)<-[:HAS]-(event:Event {eventId: {eventId}})<-[:EVENT]-(page:Page {pageId: '1'})")
                .optionalMatch("(page)-[rel:HAS]->(address)")
                .return(`event, address, page, rel`)
                .end({eventId: eventId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].page.label.should.equals("Generic");

            resp[0].address.description.should.equals("Zuerich");
            resp[0].address.latitude.should.equals(47.376887);
            resp[0].address.longitude.should.equals(8.541694);
            should.exist(resp[0].address.addressId);
            should.not.exist(resp[0].rel);

            resp[0].event.title.should.equals("title");
            resp[0].event.description.should.equals("description");
            resp[0].event.created.should.be.at.least(startTime);
            resp[0].event.eventId.should.equals(eventId);
            resp[0].event.startDate.should.equals(startTime + 500);
            resp[0].event.endDate.should.equals(startTime + 600);
        });
    });

    it('Create a new event with existing address- Return 200', function () {

        let createEvent = {
            title: 'title',
            description: 'description',
            genericPageId: '1',
            startDate: startTime + 500,
            endDate: startTime + 600,
            existingAddressId: '1'
        }, eventId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            eventId = res.body.eventId;
            return db.cypher().match("(address:Address)<-[:HAS]-(event:Event {eventId: {eventId}})<-[:EVENT]-(page:Page {pageId: '1'})")
                .optionalMatch("(page)-[rel:HAS]->(address)")
                .return(`event, address, page, rel`)
                .end({eventId: eventId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].page.label.should.equals("Generic");

            resp[0].address.description.should.equals("Zuerich");
            resp[0].address.latitude.should.equals(47.376887);
            resp[0].address.longitude.should.equals(8.541694);
            should.exist(resp[0].rel);

            resp[0].event.title.should.equals("title");
            resp[0].event.description.should.equals("description");
            resp[0].event.created.should.be.at.least(startTime);
            resp[0].event.eventId.should.equals(eventId);
            resp[0].event.startDate.should.equals(startTime + 500);
            resp[0].event.endDate.should.equals(startTime + 600);
        });
    });

    it('Create a new event with existing address failed because of not existing address (400)', function () {

        let createEvent = {
            title: 'title',
            description: 'description',
            genericPageId: '1',
            startDate: startTime + 500,
            endDate: startTime + 600,
            existingAddressId: '2'
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create a new event fails because page does not exist (400)', function () {

        let createEvent = {
            title: 'title',
            description: 'description',
            genericPageId: '10',
            startDate: startTime + 500,
            endDate: startTime + 600,
            address: {description: 'Zuerich', lat: 47.376887, lng: 8.541694}
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create a new event fails because user is not admin of page (400)', function () {

        let createEvent = {
            title: 'title',
            description: 'description',
            genericPageId: '2',
            startDate: startTime + 500,
            endDate: startTime + 600,
            address: {description: 'Zuerich', lat: 47.376887, lng: 8.541694}
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create a new event fails because end data is before start date (400)', function () {

        let createEvent = {
            title: 'title',
            description: 'description',
            genericPageId: '1',
            startDate: startTime + 500,
            endDate: startTime + 499,
            address: {description: 'Zuerich', lat: 47.376887, lng: 8.541694}
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Create a new event fails because start date is in the past (400)', function () {

        let createEvent = {
            title: 'title',
            description: 'description',
            genericPageId: '1',
            startDate: startTime - 1,
            endDate: startTime + 20,
            address: {description: 'Zuerich', lat: 47.376887, lng: 8.541694}
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
