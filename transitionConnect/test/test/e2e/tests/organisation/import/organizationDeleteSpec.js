'use strict';

let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Delete of imported organizations from tc', function () {

    beforeEach(function () {
        return dbDsl.init(2);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Mark an imported organization from tc for deleting', async function () {

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
        await dbDsl.sendToDb();
        let res = await requestHandler.del('/api/v1/organisation/1');
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page:ImportTC {pageId: '1'})")
            .return(`org.markDeleted As markDeleted`).end().send();
        resp.length.should.equals(1);
        resp[0].markDeleted.should.equals(true);
    });
});
