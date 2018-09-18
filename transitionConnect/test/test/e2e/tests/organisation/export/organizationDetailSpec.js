'use strict';

let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Integration Tests for exporting an organisation', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, modified: 501, title: 'organization', description: 'description', website: 'www.link.org',
            language: ['de'], topic: ['health']
        }, [{
            address: 'Zuerich',
            description: 'ZuerichDescription',
            lat: 47.376887,
            lng: 8.541694,
            addressId: '1'
        }, {
            address: 'Zuerich2',
            description: 'ZuerichDescription2',
            lat: 47.376888,
            lng: 8.541695,
            addressId: '2'
        }]);
        dbDsl.createGenericPage('2', {
            adminId: '1', created: 500, modified: 501, title: 'organization2', description: 'description2', website: 'www.link.org',
            language: ['de'], topic: ['health']
        }, []);
        dbDsl.createGenericPage('3', {
            adminId: '2', created: 600, title: 'organization3', description: 'description3', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment', 'spiritual']
        }, []);
        dbDsl.exportOrganisationToTransitionConnect({pageId: '1', timestampExportStarted: 800});
        dbDsl.exportOrganisationToTransitionConnect({pageId: '2', timestampExportStarted: 800});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    // Export of imported organization is not possible

    it('Export an organisation with locations', async function () {

        dbDsl.addAdminToPage('3', '1');

        await dbDsl.sendToDb();
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
        res.body.locations.length.should.equals(2);
        res.body.locations[0].address.should.equals('Zuerich');
        res.body.locations[0].description.should.equals('ZuerichDescription');
        res.body.locations[0].geo.latitude.should.equals(47.376887);
        res.body.locations[0].geo.longitude.should.equals(8.541694);
        res.body.locations[1].address.should.equals('Zuerich2');
        res.body.locations[1].description.should.equals('ZuerichDescription2');
        res.body.locations[1].geo.latitude.should.equals(47.376888);
        res.body.locations[1].geo.longitude.should.equals(8.541695);
    });

    it('Export an organisation without locations', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/v1/organisation/2');
        res.status.should.equal(200);

        res.body.timestamp.should.equals(501);
        res.body.name.should.equals('organization2');
        res.body.description.should.equals('description2');
        res.body.slogan.should.equals('');
        res.body.website.should.equals('www.link.org');
        res.body.categories.length.should.equals(1);
        res.body.categories[0].should.equals('health');
        res.body.admins.length.should.equals(1);
        res.body.admins[0].should.equals('user@irgendwo.ch');
        res.body.locations.length.should.equals(0);
    });

    it('Not allowed to export organisation because not exported to tc', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/v1/organisation/3');
        res.status.should.equal(400);
    });

});
