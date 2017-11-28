'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for exporting an organisation', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, modified: 501, title: 'organization', description: 'description', website: 'www.link.org',
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
        dbDsl.exportOrganisationToTransitionConnect({pageId: '1'});
        dbDsl.exportOrganisationToTransitionConnect({pageId: '2'});
        dbDsl.exportOrganisationToTransitionConnect({pageId: '3'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    // Export of imported organization is not possible

    it('Export an organisation', async function () {

        dbDsl.addAdminToPage('3', '1');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/v1/organisation/1');
        res.status.should.equal(200);

        res.body.timestamp.should.equals(501);
        res.body.name.should.equals('organization');
        res.body.description.should.equals('description');
        res.body.slogan.should.equals('');
        res.body.website.should.equals('www.link.org');
        res.body.categories.length.should.equals(1);
        res.body.categories[0].should.equals('health');
        res.body.admins.length.should.equals(2);
        res.body.admins[0].should.equals('user3@irgendwo.ch');
        res.body.admins[1].should.equals('user@irgendwo.ch');
    });

    it('Not allowed to export organisation because not exported to tc', async function () {

        dbDsl.addAdminToPage('3', '1');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/v1/organisation/4');
        res.status.should.equal(400);
    });

});
