'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let should = require('chai').should();
let moment = require('moment');

describe('Integration Tests for setting the sync state to the transition connect service', function () {

    let startTime;

    beforeEach(async function () {

        await dbDsl.init(2);
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, title: 'organization', description: 'description', website: 'www.link.org',
            language: ['de'], topic: ['health']
        }, []);

        dbDsl.createGenericPage('3', {
            adminId: '1', created: 500, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['de'], topic: ['health']
        }, []);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Activate the synchronisation with events', async function () {
        dbDsl.createPageEventNewAddress('1', {
            eventId: '1', title: 'Event', description: 'Super Event',
            startDate: 500, endDate: 600
        }, {addressId: '1', address: 'Urdorf', lat: 48.05642, lng: 8.36542});
        dbDsl.createPageEventNewAddress('1', {
            eventId: '2', title: 'Event2', description: 'Super Event2',
            startDate: 501, endDate: 601
        }, {addressId: '2', address: 'Urdorf2', lat: 48.05641, lng: 8.36541});
        dbDsl.createPageEventNewAddress('3', {
            eventId: '3', title: 'Event3', description: 'Super Event3',
            startDate: 502, endDate: 602
        }, {addressId: '3', address: 'Urdorf3', lat: 48.05640, lng: 8.36540});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/page/transitionConnect/sync/1', {state: true});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC]->(page:Page {pageId: '1'})`)
            .return(`export.timestampExportStarted AS timestampExportStarted`).end().send();
        resp.length.should.equals(1);
        resp[0].timestampExportStarted.should.be.at.least(startTime);

        resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_EVENT_TO_TC]->(event:Event)`)
            .return(`event.eventId AS eventId, export.timestampExportStarted AS timestampExportStarted`)
            .orderBy(`eventId`).end().send();
        resp.length.should.equals(2);
        resp[0].eventId.should.equals('1');
        resp[0].timestampExportStarted.should.be.at.least(startTime);
        resp[1].eventId.should.equals('2');
        resp[1].timestampExportStarted.should.be.at.least(startTime);
    });

    it('Activate the synchronisation without events', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/page/transitionConnect/sync/1', {state: true});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC]->(page:Page {pageId: '1'})`)
            .return(`export.timestampExportStarted AS timestampExportStarted`).end().send();
        resp.length.should.equals(1);
        resp[0].timestampExportStarted.should.be.at.least(startTime);
    });

    it('Activate a deactivated synchronisation with events', async function () {
        dbDsl.createPageEventNewAddress('1', {
            eventId: '1', title: 'Event', description: 'Super Event',
            startDate: 500, endDate: 600
        }, {addressId: '1', address: 'Urdorf', lat: 48.05642, lng: 8.36542});
        dbDsl.stopExportOrganisationToTransitionConnect({pageId: '1', timestampExportStarted: 800});
        dbDsl.exportEventToTransitionConnect({eventId: '1', timestampExportStarted: 700});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/page/transitionConnect/sync/1', {state: true});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC]->(page:Page {pageId: '1'})`)
            .return(`export.timestampExportStarted AS timestampExportStarted`).end().send();
        resp.length.should.equals(1);
        resp[0].timestampExportStarted.should.equals(800);

        resp = await db.cypher().match(`(:TransitionConnectExport)-[export:STOP_EXPORT_TO_TC]->(page:Page {pageId: '1'})`)
            .return(`export.timestampExportStarted AS timestampExportStarted`).end().send();
        resp.length.should.equals(0);

        resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_EVENT_TO_TC]->(event:Event {eventId: '1'})`)
            .return(`export.timestampExportStarted AS timestampExportStarted`).end().send();
        resp.length.should.equals(1);
        resp[0].timestampExportStarted.should.equals(700);
    });

    it('Activate a deactivated synchronisation without events', async function () {
        dbDsl.stopExportOrganisationToTransitionConnect({pageId: '1', timestampExportStarted: 800});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/page/transitionConnect/sync/1', {state: true});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC]->(page:Page {pageId: '1'})`)
            .return(`export.timestampExportStarted AS timestampExportStarted`).end().send();
        resp.length.should.equals(1);
        resp[0].timestampExportStarted.should.equals(800);

        resp = await db.cypher().match(`(:TransitionConnectExport)-[export:STOP_EXPORT_TO_TC]->(page:Page {pageId: '1'})`)
            .return(`export.timestampExportStarted AS timestampExportStarted`).end().send();
        resp.length.should.equals(0);
    });

    it('Deactivate the synchronisation', async function () {
        dbDsl.exportOrganisationToTransitionConnect({pageId: '1', timestampExportStarted: 800});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/page/transitionConnect/sync/1', {state: false});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(page:Page {pageId: '1'})<-[export:STOP_EXPORT_TO_TC]-(:TransitionConnectExport)`)
            .return(`export.timestampExportStarted AS timestampExportStarted`).end().send();
        resp.length.should.equals(1);
        resp[0].timestampExportStarted.should.equals(800);
    });

    it('No allowed to activate the synchronisation on imported organization', async function () {
        dbDsl.createGenericPage('2', {
            adminId: '1', created: 600, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment', 'spiritual'], importTC: true
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/page/transitionConnect/sync/2', {state: true});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(page:Page {pageId: '2'})`)
            .optionalMatch(`(page)<-[export:EXPORT_TO_TC]-(:TransitionConnectExport)`)
            .return(`page, export`).end().send();
        resp.length.should.equals(1);
        should.not.exist(resp[0].export);
    });

    it('User is not administrator of organization', async function () {
        dbDsl.createGenericPage('2', {
            adminId: '2', created: 600, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment', 'spiritual']
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/page/transitionConnect/sync/2', {state: true});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(page:Page {pageId: '2'})`)
            .optionalMatch(`(page)<-[export:EXPORT_TO_TC]-(:TransitionConnectExport)`)
            .return(`page, export`).end().send();
        resp.length.should.equals(1);
        should.not.exist(resp[0].export);
    });
});
