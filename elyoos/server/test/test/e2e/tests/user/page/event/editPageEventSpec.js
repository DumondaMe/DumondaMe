'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let should = require('chai').should();
let stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Integration Tests for edit events of generic pages', function () {

    let requestAgent, startTime;

    beforeEach(function () {

        stubCDN.uploadFile.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(2).then(function () {
            dbDsl.createGenericPage('0', '1', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                description: 'Zuerich',
                lat: 47.376887,
                lng: 8.541694,
                addressId: '1'
            }, {
                description: 'Zuerich10',
                lat: 47.37688734,
                lng: 8.54169456,
                addressId: '2'
            }]);
            dbDsl.createGenericPage('1', '2', ['de'], ['health', 'personalDevelopment'], 100, null, [{
                description: 'Zuerich',
                lat: 47.3768874,
                lng: 8.5416944,
                addressId: '3'
            }]);

            dbDsl.createPageEventExistingAddress('0', {
                eventId: '10', title: 'Event1', description: 'Super Event1',
                startDate: startTime + 500, endDate: startTime + 550
            }, '1');
            dbDsl.createPageEventExistingAddress('1', {
                eventId: '11', title: 'Event2', description: 'Super Event2',
                startDate: startTime + 501, endDate: startTime + 551
            }, '3');
            dbDsl.createPageEventNewAddress('0', {
                eventId: '12', title: 'Event3', description: 'Super Event3',
                startDate: startTime - 2, endDate: startTime + 600
            }, {addressId: '10', description: 'Urdorf', lat: 48.05642, lng: 8.36542});

            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Edit an event and add new address (Previous address belongs to generic page)- Return 200', function () {

        let createEvent = {
            edit: {
                eventId: '10',
                title: 'title',
                description: 'description',
                startDate: startTime + 600,
                endDate: startTime + 700,
                address: {description: 'Zuerich2', lat: 47.37688, lng: 8.54169}
            }
        }, eventId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(address:Address)<-[:HAS]-(event:Event {eventId: '10'})<-[:EVENT]-(page:Page {pageId: '0'})")
                .optionalMatch("(page)-[rel:HAS]->(address)")
                .optionalMatch("(page)-[rel2:HAS]->(:Address {addressId: '1'})")
                .return(`event, address, page, rel, rel2`)
                .end({eventId: eventId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].page.label.should.equals("Generic");

            resp[0].address.description.should.equals("Zuerich2");
            resp[0].address.latitude.should.equals(47.37688);
            resp[0].address.longitude.should.equals(8.54169);
            should.exist(resp[0].address.addressId);
            should.not.exist(resp[0].rel);
            should.exist(resp[0].rel2);

            resp[0].event.title.should.equals("title");
            resp[0].event.description.should.equals("description");
            resp[0].event.modified.should.be.at.least(startTime);
            resp[0].event.startDate.should.equals(startTime + 600);
            resp[0].event.endDate.should.equals(startTime + 700);
        });
    });

    it('Edit an event and add new address (Previous address belongs only to event)- Return 200', function () {

        let createEvent = {
            edit: {
                eventId: '12',
                title: 'title',
                description: 'description',
                startDate: startTime + 600,
                endDate: startTime + 700,
                address: {description: 'Zuerich2', lat: 47.37688, lng: 8.54169}
            }
        }, eventId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(address:Address)<-[:HAS]-(event:Event {eventId: '12'})<-[:EVENT]-(page:Page {pageId: '0'})")
                .optionalMatch("(page)-[rel:HAS]->(address)")
                .optionalMatch("(page)-[rel2:HAS]->(:Address {addressId: '10'})")
                .return(`event, address, page, rel, rel2`)
                .end({eventId: eventId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].page.label.should.equals("Generic");

            resp[0].address.description.should.equals("Zuerich2");
            resp[0].address.latitude.should.equals(47.37688);
            resp[0].address.longitude.should.equals(8.54169);
            should.exist(resp[0].address.addressId);
            should.not.exist(resp[0].rel);
            should.not.exist(resp[0].rel2);

            resp[0].event.title.should.equals("title");
            resp[0].event.description.should.equals("description");
            resp[0].event.modified.should.be.at.least(startTime);
            resp[0].event.startDate.should.equals(startTime + 600);
            resp[0].event.endDate.should.equals(startTime + 700);
        });
    });

    it('Edit an event and add existing address (Previous address belongs to generic page)- Return 200', function () {

        let createEvent = {
            edit: {
                eventId: '10',
                title: 'title',
                description: 'description',
                startDate: startTime + 600,
                endDate: startTime + 700,
                existingAddressId: '2'
            }
        }, eventId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(address:Address {addressId: '2'})<-[:HAS]-(event:Event {eventId: '10'})<-[:EVENT]-(page:Page {pageId: '0'})")
                .optionalMatch("(page)-[rel:HAS]->(address)")
                .optionalMatch("(page)-[rel2:HAS]->(:Address {addressId: '1'})")
                .return(`event, address, page, rel, rel2`)
                .end({eventId: eventId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].page.label.should.equals("Generic");

            resp[0].address.description.should.equals("Zuerich10");
            resp[0].address.latitude.should.equals(47.37688734);
            resp[0].address.longitude.should.equals(8.54169456);
            should.exist(resp[0].rel);
            should.exist(resp[0].rel2);

            resp[0].event.title.should.equals("title");
            resp[0].event.description.should.equals("description");
            resp[0].event.modified.should.be.at.least(startTime);
            resp[0].event.startDate.should.equals(startTime + 600);
            resp[0].event.endDate.should.equals(startTime + 700);
        });
    });

    it('Edit an event and add existing address (Previous address belongs only to event)- Return 200', function () {

        let createEvent = {
            edit: {
                eventId: '12',
                title: 'title',
                description: 'description',
                startDate: startTime + 600,
                endDate: startTime + 700,
                existingAddressId: '2'
            }
        }, eventId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(address:Address {addressId: '2'})<-[:HAS]-(event:Event {eventId: '12'})<-[:EVENT]-(page:Page {pageId: '0'})")
                .optionalMatch("(page)-[rel:HAS]->(address)")
                .optionalMatch("(previousAddress:Address {addressId: '10'})")
                .return(`event, address, page, rel, previousAddress`)
                .end({eventId: eventId}).send();
        }).then(function (resp) {
            resp.length.should.equals(1);
            resp[0].page.label.should.equals("Generic");

            resp[0].address.description.should.equals("Zuerich10");
            resp[0].address.latitude.should.equals(47.37688734);
            resp[0].address.longitude.should.equals(8.54169456);
            should.exist(resp[0].rel);
            should.not.exist(resp[0].previousAddress);

            resp[0].event.title.should.equals("title");
            resp[0].event.description.should.equals("description");
            resp[0].event.modified.should.be.at.least(startTime);
            resp[0].event.startDate.should.equals(startTime + 600);
            resp[0].event.endDate.should.equals(startTime + 700);
        });
    });

    it('Not allowed to edit event of other admin - Return 400', function () {

        let createEvent = {
            edit: {
                eventId: '11',
                title: 'title',
                description: 'description',
                startDate: startTime + 600,
                endDate: startTime + 700,
                existingAddressId: '2'
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });

    it('Not allowed to link to a address of other page - Return 400', function () {

        let createEvent = {
            edit: {
                eventId: '10',
                title: 'title',
                description: 'description',
                startDate: startTime + 600,
                endDate: startTime + 700,
                existingAddressId: '3'
            }
        };

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/event', createEvent, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
