'use strict';

let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting a list of all events for exporting to tc', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, modified: 501, title: 'organization', description: 'description', website: 'www.link.org',
            language: ['de'], topic: ['health']
        }, []);
        dbDsl.createGenericPage('2', {
            adminId: '2', created: 600, modified: 603, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment', 'spiritual']
        }, []);
        dbDsl.createGenericPage('3', {
            adminId: '2', created: 601, modified: 602, title: 'organization3', description: 'description3', website: 'www.link3.org',
            language: ['en'], topic: ['spiritual']
        }, []);
        dbDsl.createGenericPage('4', {
            adminId: '2', created: 602, modified: 601, title: 'organization4', description: 'description4', website: 'www.link4.org',
            language: ['en'], topic: ['spiritual']
        }, []);
        dbDsl.exportOrganisationToTransitionConnect({pageId: '3', timestampExportStarted: 801});

        dbDsl.createPageEventNewAddress('1', {
            eventId: '1', title: 'Event', description: 'Super Event', modified: 705,
            startDate: 500, endDate: 600
        }, {addressId: '1', address: 'Urdorf', lat: 48.05642, lng: 8.36542});
        dbDsl.createPageEventNewAddress('1', {
            eventId: '2', title: 'Event2', description: 'Super Event2', modified: 703,
            startDate: 501, endDate: 601
        }, {addressId: '2', address: 'Urdorf2', lat: 48.05641, lng: 8.36541});
        dbDsl.createPageEventNewAddress('3', {
            eventId: '3', title: 'Event3', description: 'Super Event3', modified: 704,
            startDate: 502, endDate: 602
        }, {addressId: '3', address: 'Urdorf3', lat: 48.05640, lng: 8.36540});
        dbDsl.createPageEventNewAddress('4', {
            eventId: '4', title: 'Event4', description: 'Super Event4', modified: 700,
            startDate: 503, endDate: 603
        }, {addressId: '4', address: 'Urdorf4', lat: 48.05643, lng: 8.36543});

        dbDsl.exportEventToTransitionConnect({eventId: '1', timestampExportStarted: 802});
        dbDsl.exportEventToTransitionConnect({eventId: '2', timestampExportStarted: 803});
        dbDsl.exportEventToTransitionConnect({eventId: '3', timestampExportStarted: 804});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting list of events for exporting to tc', async function () {

        dbDsl.exportOrganisationToTransitionConnect({pageId: '1', timestampExportStarted: 801});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/v1/event', {skip: 0});
        res.status.should.equal(200);

        res.body.events.length.should.equals(3);
        res.body.events[0].uid.should.equals('1@elyoos.org');
        res.body.events[0].timestamp.should.equals(705);
        res.body.events[1].uid.should.equals('2@elyoos.org');
        res.body.events[1].timestamp.should.equals(703);
        res.body.events[2].uid.should.equals('3@elyoos.org');
        res.body.events[2].timestamp.should.equals(704);
    });

    it('Skip list', async function () {

        dbDsl.exportOrganisationToTransitionConnect({pageId: '1', timestampExportStarted: 801});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/v1/event', {skip: 1});
        res.status.should.equal(200);

        res.body.events.length.should.equals(2);
        res.body.events[0].uid.should.equals('2@elyoos.org');
        res.body.events[0].timestamp.should.equals(703);
        res.body.events[1].uid.should.equals('3@elyoos.org');
        res.body.events[1].timestamp.should.equals(704);
    });

    it('Calling api/v1/organisation with skip = 0 does remove all EXPORT_EVENT_TO_TC of the organisation with STOP_EXPORT_TO_TC', async function () {

        dbDsl.stopExportOrganisationToTransitionConnect({pageId: '1', timestampExportStarted: 801});
        await dbDsl.sendToDb();
        await requestHandler.get('/api/v1/organisation', {skip: 0});
        let res = await requestHandler.get('/api/v1/event', {skip: 0});
        res.status.should.equal(200);

        res.body.events.length.should.equals(1);
        res.body.events[0].uid.should.equals('3@elyoos.org');
        res.body.events[0].timestamp.should.equals(704);
    });

});
