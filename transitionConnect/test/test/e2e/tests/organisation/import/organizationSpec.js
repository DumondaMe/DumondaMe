'use strict';

let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let moment = require('moment');
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Importing organizations from tc', function () {

    let startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(2);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Import modified organization with all possible properties', async function () {

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
        let res = await requestHandler.put('/api/v1/organisation/1', {
            name: 'organization', description: 'description', slogan: 'slogan', website: 'www.link.org',
            categories: ['health', 'spiritual'],
            locations: [{address: 'Technoparkstrasse 1, 8005 Zürich', description: 'Unser Standort', geo: {latitude: 32.422422, longitude: -122.08585}}]
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page:ImportTC)-[:HAS]->(address:Address)")
            .return(`org, collect(address) AS addresses`).end().send();
        resp.length.should.equals(1);
        resp[0].org.title.should.equals('organization');
        resp[0].org.description.should.equals('description');
        resp[0].org.slogan.should.equals('slogan');
        resp[0].org.website.should.equals('www.link.org');
        resp[0].org.modified.should.be.at.least(startTime);
        resp[0].org.topic.length.should.equals(2);
        resp[0].org.topic[0].should.equals('health');
        resp[0].org.topic[1].should.equals('spiritual');
        resp[0].org.language.length.should.equals(1);
        resp[0].org.language[0].should.equals('de');
        resp[0].addresses.length.should.equals(1);
        resp[0].addresses[0].address.should.equals('Technoparkstrasse 1, 8005 Zürich');
        resp[0].addresses[0].description.should.equals('Unser Standort');
        resp[0].addresses[0].latitude.should.equals(32.422422);
        resp[0].addresses[0].longitude.should.equals(-122.08585);
    });

    it('Import modified organization with only required properties', async function () {

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment'], importTC: true
        }, [{
            address: 'Zuerich',
            description: 'ZuerichDescription',
            lat: 47.376887,
            lng: 8.541694,
            addressId: '1'
        }]);
        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/v1/organisation/1', {
            name: 'organization', description: 'description', categories: ['health', 'spiritual']
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page:ImportTC)")
            .optionalMatch("(org)-[:HAS]->(address:Address)")
            .return(`org, collect(address) AS addresses`).end().send();
        resp.length.should.equals(1);
        resp[0].org.title.should.equals('organization');
        resp[0].org.description.should.equals('description');
        should.not.exist(resp[0].org.slogan);
        should.not.exist(resp[0].org.website);
        resp[0].org.modified.should.be.at.least(startTime);
        resp[0].org.topic.length.should.equals(2);
        resp[0].org.topic[0].should.equals('health');
        resp[0].org.topic[1].should.equals('spiritual');
        resp[0].org.language.length.should.equals(1);
        resp[0].org.language[0].should.equals('fr');
        resp[0].addresses.length.should.equals(0);
    });

    it('Import modified organization with location and no previously defined address', async function () {

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment'], importTC: true
        }, []);
        await dbDsl.sendToDb();
        let res = await requestHandler.put('/api/v1/organisation/1', {
            name: 'organization', description: 'description', categories: ['health', 'spiritual'],
            locations: [{address: 'Technoparkstrasse 1, 8005 Zürich', description: 'Unser Standort', geo: {latitude: 32.422422, longitude: -122.08585}}]
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page:ImportTC)-[:HAS]->(address:Address)")
            .return(`org, collect(address) AS addresses`).end().send();
        resp.length.should.equals(1);
        resp[0].org.title.should.equals('organization');
        resp[0].org.description.should.equals('description');
        should.not.exist(resp[0].org.slogan);
        should.not.exist(resp[0].org.website);
        resp[0].org.modified.should.be.at.least(startTime);
        resp[0].org.topic.length.should.equals(2);
        resp[0].org.topic[0].should.equals('health');
        resp[0].org.topic[1].should.equals('spiritual');
        resp[0].org.language.length.should.equals(1);
        resp[0].org.language[0].should.equals('fr');
        resp[0].addresses.length.should.equals(1);
        resp[0].addresses[0].address.should.equals('Technoparkstrasse 1, 8005 Zürich');
        resp[0].addresses[0].description.should.equals('Unser Standort');
        resp[0].addresses[0].latitude.should.equals(32.422422);
        resp[0].addresses[0].longitude.should.equals(-122.08585);
    });

    it('Import of not existing organization', async function () {

        await dbDsl.sendToDb();
        let res = await requestHandler.post('/api/v1/organisation', {
            uuid: '1', name: 'organization', description: 'description', slogan: 'slogan', website: 'www.link.org',
            admins: ['user@irgendwo.ch', 'user10@irgendwo.ch'], categories: ['health', 'spiritual'],
            locations: [{address: 'Technoparkstrasse 1, 8005 Zürich', description: 'Unser Standort', geo: {latitude: 32.422422, longitude: -122.08585}}]
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(admin:User)-[:IS_ADMIN]->(org:Page:ImportTC)-[:HAS]->(address:Address)")
            .optionalMatch(`(adminOnlyTc:TcUser)-[:IS_ADMIN]->(org)`)
            .return(`org, admin, adminOnlyTc, collect(address) AS addresses`).end().send();
        resp.length.should.equals(1);
        resp[0].org.title.should.equals('organization');
        resp[0].org.pageId.should.equals(res.body.id);
        resp[0].org.description.should.equals('description');
        resp[0].org.slogan.should.equals('slogan');
        resp[0].org.website.should.equals('www.link.org');
        resp[0].org.label.should.equals('Generic');
        resp[0].org.created.should.be.at.least(startTime);
        resp[0].org.modified.should.be.at.least(startTime);
        resp[0].org.topic.length.should.equals(2);
        resp[0].org.topic[0].should.equals('health');
        resp[0].org.topic[1].should.equals('spiritual');
        resp[0].org.language.length.should.equals(1);
        resp[0].org.language[0].should.equals('de');
        resp[0].admin.email.should.equals('user@irgendwo.ch');
        resp[0].adminOnlyTc.email.should.equals('user10@irgendwo.ch');
        resp[0].addresses[0].address.should.equals('Technoparkstrasse 1, 8005 Zürich');
        resp[0].addresses[0].description.should.equals('Unser Standort');
        resp[0].addresses[0].latitude.should.equals(32.422422);
        resp[0].addresses[0].longitude.should.equals(-122.08585);
    });
});
