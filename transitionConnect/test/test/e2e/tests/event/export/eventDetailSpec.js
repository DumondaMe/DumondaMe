'use strict';

let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Integration Tests for getting the detail of an event exporting to tc', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, modified: 501, title: 'organization', description: 'description', website: 'www.link.org',
            language: ['de'], topic: ['health', 'spiritual']
        }, []);
        dbDsl.createGenericPage('2', {
            adminId: '2', created: 600, modified: 603, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment', 'spiritual']
        }, []);
        dbDsl.exportOrganisationToTransitionConnect({pageId: '2', timestampExportStarted: 801});

        dbDsl.createPageEventNewAddress('1', {
            eventId: '1', title: 'Event', description: 'Super Event', modified: 705,
            startDate: 1512803955, endDate: 1512810000
        }, {addressId: '1', address: 'Urdorf', lat: 48.05642, lng: 8.36542});
        dbDsl.createPageEventNewAddress('1', {
            eventId: '2', title: 'Event2', description: 'Super Event2', modified: 703,
            startDate: 1512803956, endDate: 1512810001
        }, {addressId: '2', address: 'Urdorf2', lat: 48.05641, lng: 8.36541});

        dbDsl.exportEventToTransitionConnect({eventId: '2', timestampExportStarted: 802});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get detail of an event exported to tc', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/v1/event/2%40elyoos.org');
        res.status.should.equal(200);

        let extractedTimestamp = res.body.iCal.substring(res.body.iCal.indexOf('DTSTAMP:'), res.body.iCal.indexOf('DTSTART') - 1);
        res.body.idOrg.should.equals('1');
        res.body.iCal.should.to.include(`BEGIN:VEVENT\r
UID:2@elyoos.org\r
SEQUENCE:0\r
${extractedTimestamp}
DTSTART:20171209T071916Z\r
DTEND:20171209T090001Z\r
SUMMARY:Event2\r
DESCRIPTION:Super Event2\r
CATEGORIES:health,spiritual\r
LOCATION:Urdorf2\r
GEO:48.05641,8.36541\r
END:VEVENT`);
    });

});
