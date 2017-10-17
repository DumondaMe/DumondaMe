'use strict';

let db = require('elyoos-server-test-util').db;
let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for exporting organizations', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createTransitionConnectExportNode();

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, title: 'organization', description: 'description', website: 'www.link.org',
            language: ['de'], topic: ['health']
        }, []);
        dbDsl.createGenericPage('2', {
            adminId: '2', created: 600, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment', 'spiritual']
        }, []);
        dbDsl.createGenericPage('3', {
            adminId: '2', created: 601, title: 'organization3', description: 'description3', website: 'www.link3.org',
            language: ['en'], topic: ['spiritual']
        }, []);
        dbDsl.createGenericPage('4', {
            adminId: '2', created: 602, title: 'organization4', description: 'description4', website: 'www.link4.org',
            language: ['en'], topic: ['spiritual']
        }, []);
        dbDsl.exportOrganizationToTransitionConnect({pageId: '1'});
        dbDsl.exportOrganizationToTransitionConnect({pageId: '2'});
        dbDsl.exportOrganizationToTransitionConnect({pageId: '3'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    // Export of imported organization is not possible

    it('Export never exported organization', async function () {

        dbDsl.exportOrganizationToTransitionConnectIsPending({pageId: '1'});
        dbDsl.exportOrganizationToTransitionConnectIsPending({pageId: '2'});
        dbDsl.addAdminToPage('3', '1');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/organization');
        res.status.should.equal(200);

        res.body.hasNext.should.equals(false);
        res.body.organizations.length.should.equals(2);
        res.body.organizations[0].id.should.equals('1');
        res.body.organizations[0].name.should.equals('organization');
        res.body.organizations[0].description.should.equals('description');
        res.body.organizations[0].slogan.should.equals('');
        res.body.organizations[0].website.should.equals('www.link.org');
        res.body.organizations[0].language.should.equals('de');
        res.body.organizations[0].categories.length.should.equals(1);
        res.body.organizations[0].categories[0].should.equals('health');
        res.body.organizations[0].administrators.length.should.equals(2);
        res.body.organizations[0].administrators[0].should.equals('user3@irgendwo.ch');
        res.body.organizations[0].administrators[1].should.equals('user@irgendwo.ch');

        res.body.organizations[1].id.should.equals('2');
        res.body.organizations[1].name.should.equals('organization2');
        res.body.organizations[1].description.should.equals('description2');
        res.body.organizations[1].slogan.should.equals('');
        res.body.organizations[1].website.should.equals('www.link2.org');
        res.body.organizations[1].language.should.equals('fr');
        res.body.organizations[1].categories.length.should.equals(2);
        res.body.organizations[1].categories[0].should.equals('personalDevelopment');
        res.body.organizations[1].categories[1].should.equals('spiritual');
        res.body.organizations[1].administrators.length.should.equals(1);
        res.body.organizations[1].administrators[0].should.equals('user2@irgendwo.ch');

        res = await requestHandler.get('/api/organization');
        res.status.should.equal(200);
        res.body.organizations.length.should.equals(0);

        let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC_PENDING]->(:Page)`)
            .return(`export`).end().send();
        resp.length.should.equals(0);
    });

});
