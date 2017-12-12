'use strict';

let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Delete imported events from tc', function () {


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

    it('Delete imported Event', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.del('/api/v1/event/1@elyoos.org');
        res.status.should.equal(200);
        let resp = await db.cypher().match("(event:Event:ImportTC {eventId: '1'})-[:HAS]->(:Address)")
            .return(`event`).end().send();
        resp.length.should.equals(0);
    });
});
