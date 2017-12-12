'use strict';

let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Importing event from tc', function () {


    beforeEach(async function () {
        await dbDsl.init(2);

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['de'], topic: ['personalDevelopment'], importTC: true
        }, [{
            address: 'Zuerich',
            description: 'ZuerichDescription',
            lat: 47.376887,
            lng: 8.541694,
            addressId: '1'
        }]);

        dbDsl.createPageEventNewAddress('1', {
            eventId: '1', title: 'Event', description: 'Super Event', modified: 705,
            startDate: 500, endDate: 600, importTC: true
        }, {addressId: '2', address: 'Urdorf', lat: 48.05642, lng: 8.36542});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Import modified event', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/v1/event/1@elyoos.org', {
            iCal: `BEGIN:VEVENT
UID:1@elyoos.org
SEQUENCE:0
DTSTART:20171209T071916Z
DTEND:20171209T090001Z
SUMMARY:Event2
DESCRIPTION:Super Event2
Test
CATEGORIES:health,spiritual
LOCATION:Urdorf2
GEO:48.05641;8.36541
END:VEVENT`
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(event:Event:ImportTC {eventId: '1'})-[:HAS]->(address:Address)")
            .return(`event, collect(address) AS addresses`).end().send();
        resp.length.should.equals(1);
        resp[0].event.title.should.equals('Event2');
        resp[0].event.description.should.equals('Super Event2\nTest');
        resp[0].event.startDate.should.equals(1512803956);
        resp[0].event.endDate.should.equals(1512810001);
        resp[0].addresses.length.should.equals(1);
        resp[0].addresses[0].address.should.equals('Urdorf2');
        resp[0].addresses[0].latitude.should.equals(48.05641);
        resp[0].addresses[0].longitude.should.equals(8.36541);
    });

    it('Import modified event without location', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/v1/event/1@elyoos.org', {
            iCal: `BEGIN:VEVENT
UID:1@elyoos.org
SEQUENCE:0
DTSTART:20171209T071916Z
DTEND:20171209T090001Z
SUMMARY:Event2
DESCRIPTION:Super Event2
Test
CATEGORIES:health,spiritual
END:VEVENT`
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(event:Event:ImportTC {eventId: '1'})")
            .optionalMatch(`(event)-[:HAS]->(address:Address)`)
            .return(`event, collect(address) AS addresses`).end().send();
        resp.length.should.equals(1);
        resp[0].event.title.should.equals('Event2');
        resp[0].event.description.should.equals('Super Event2\nTest');
        resp[0].event.startDate.should.equals(1512803956);
        resp[0].event.endDate.should.equals(1512810001);
        resp[0].addresses.length.should.equals(0);
    });

    it('Import a new event', async function () {

        dbDsl.createGenericPage('2', {
            adminId: '1', created: 500, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['de'], topic: ['personalDevelopment'], importTC: true
        }, []);

        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/v1/event', {
            orgId: '2',
            iCal: `BEGIN:VEVENT
UID:2@elyoos.org
SEQUENCE:0
DTSTART:20171209T071916Z
DTEND:20171209T090001Z
SUMMARY:Event2
DESCRIPTION:Super Event2
Test
CATEGORIES:health,spiritual
LOCATION:Urdorf2
GEO:48.05641;8.36541
END:VEVENT`
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page)-[:EVENT]->(event:Event:ImportTC {uid: '2@elyoos.org'})-[:HAS]->(address:Address)")
            .return(`org, event, collect(address) AS addresses`).end().send();
        resp.length.should.equals(1);
        should.exist(resp[0].event.eventId);
        resp[0].org.pageId.should.equals('2');
        resp[0].event.title.should.equals('Event2');
        resp[0].event.description.should.equals('Super Event2\nTest');
        resp[0].event.startDate.should.equals(1512803956);
        resp[0].event.endDate.should.equals(1512810001);
        resp[0].addresses.length.should.equals(1);
        resp[0].addresses[0].address.should.equals('Urdorf2');
        resp[0].addresses[0].latitude.should.equals(48.05641);
        resp[0].addresses[0].longitude.should.equals(8.36541);
    });

    it('Import a new event without location', async function () {

        dbDsl.createGenericPage('2', {
            adminId: '1', created: 500, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['de'], topic: ['personalDevelopment'], importTC: true
        }, []);

        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/v1/event', {
            orgId: '2',
            iCal: `BEGIN:VEVENT
UID:2@elyoos.org
SEQUENCE:0
DTSTART:20171209T071916Z
DTEND:20171209T090001Z
SUMMARY:Event2
CATEGORIES:health,spiritual
DESCRIPTION:Super Event2
Test
END:VEVENT`
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page)-[:EVENT]->(event:Event:ImportTC {uid: '2@elyoos.org'})")
            .optionalMatch(`(event)-[:HAS]->(address:Address)`)
            .return(`org, event, collect(address) AS addresses`).end().send();
        resp.length.should.equals(1);
        should.exist(resp[0].event.eventId);
        resp[0].org.pageId.should.equals('2');
        resp[0].event.title.should.equals('Event2');
        resp[0].event.description.should.equals('Super Event2\nTest');
        resp[0].event.startDate.should.equals(1512803956);
        resp[0].event.endDate.should.equals(1512810001);
        resp[0].addresses.length.should.equals(0);
    });
});
