'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting a list of all organisation for exporting to tc', function () {

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
        dbDsl.exportOrganisationToTransitionConnect({pageId: '1'});
        dbDsl.exportOrganisationToTransitionConnect({pageId: '2'});
        dbDsl.exportOrganisationToTransitionConnect({pageId: '3'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting list of organisations for exporting to tc (sorted by created date)', async function () {


        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/v1/organisation', {skip: 0});
        res.status.should.equal(200);

        res.body.organisations.length.should.equals(3);
        res.body.organisations[0].id.should.equals('1');
        res.body.organisations[0].timestamp.should.equals(501);
        res.body.organisations[1].id.should.equals('2');
        res.body.organisations[1].timestamp.should.equals(603);
        res.body.organisations[2].id.should.equals('3');
        res.body.organisations[2].timestamp.should.equals(602);

    });

    it('Skip list', async function () {


        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/v1/organisation', {skip: 1});
        res.status.should.equal(200);

        res.body.organisations.length.should.equals(2);
        res.body.organisations[0].id.should.equals('2');
        res.body.organisations[0].timestamp.should.equals(603);
        res.body.organisations[1].id.should.equals('3');
        res.body.organisations[1].timestamp.should.equals(602);

    });

});
