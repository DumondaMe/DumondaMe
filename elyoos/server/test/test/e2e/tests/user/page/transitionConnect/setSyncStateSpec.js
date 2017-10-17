'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for setting the sync state to the transition connect service', function () {

    beforeEach(async function () {

        await dbDsl.init(2);

        dbDsl.createTransitionConnectExportNode();

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, title: 'organization', description: 'description', website: 'www.link.org',
            language: ['de'], topic: ['health']
        }, []);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Activate the synchronisation', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/transitionConnect/sync', {pageId: '1', state : true});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC]->(page:Page {pageId: '1'})`)
            .return(`page`).end().send();
        resp.length.should.equals(1);
        resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC_PENDING]->(page:Page {pageId: '1'})`)
            .return(`page`).end().send();
        resp.length.should.equals(1);
    });

    it('Deactivate the synchronisation', async function () {
        dbDsl.exportOrganizationToTransitionConnect({pageId: '1'});
        dbDsl.exportOrganizationToTransitionConnectIsPending({pageId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/transitionConnect/sync', {pageId: '1', state : false});
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC]->(page:Page {pageId: '1'})`)
            .return(`page`).end().send();
        resp.length.should.equals(0);
        resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC_PENDING]->(page:Page {pageId: '1'})`)
            .return(`page`).end().send();
        resp.length.should.equals(0);
    });

    it('No allowed to activate the synchronisation on imported organization', async function () {
        dbDsl.createGenericPage('2', {
            adminId: '1', created: 600, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment', 'spiritual'], importTC: true
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/transitionConnect/sync', {pageId: '2', state : true});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC]->(page:Page {pageId: '2'})`)
            .return(`page`).end().send();
        resp.length.should.equals(0);
        resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC_PENDING]->(page:Page {pageId: '2'})`)
            .return(`page`).end().send();
        resp.length.should.equals(0);
    });

    it('User is not administrator of organization', async function () {
        dbDsl.createGenericPage('2', {
            adminId: '2', created: 600, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment', 'spiritual']
        }, []);

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/page/transitionConnect/sync', {pageId: '2', state : true});
        res.status.should.equal(400);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC]->(page:Page {pageId: '2'})`)
            .return(`page`).end().send();
        resp.length.should.equals(0);
        resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC_PENDING]->(page:Page {pageId: '2'})`)
            .return(`page`).end().send();
        resp.length.should.equals(0);
    });
});
