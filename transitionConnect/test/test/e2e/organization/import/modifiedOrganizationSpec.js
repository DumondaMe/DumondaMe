'use strict';

let db = require('elyoos-server-test-util').db;
let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let moment = require('moment');
let requestHandler = require('elyoos-server-test-util').requestHandler;
let should = require('chai').should();

describe('Integration Tests for importing modified organizations', function () {

    let startTime;

    beforeEach(function () {
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return dbDsl.init(2);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    // Import existing organization fails because the organization was never imported from tc

    it('Import modified organization with all possible properties', async function () {

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment'], importTC: true
        }, []);
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/organization', {
            organizations: [{
                uuid: '1', name: 'organization', description: 'description', slogan: 'slogan', website: 'www.link.org',
                language: 'de', categories: ['health', 'spiritual']
            }]
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page:ImportTC)")
            .return(`org`).end().send();
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
    });

    it('Import modified organization with only required properties', async function () {

        dbDsl.createGenericPage('1', {
            adminId: '1', created: 500, title: 'organization2', description: 'description2', website: 'www.link2.org',
            language: ['fr'], topic: ['personalDevelopment'], importTC: true
        }, []);
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/organization', {
            organizations: [{
                uuid: '1', name: 'organization', description: 'description',
                language: 'de', categories: ['health', 'spiritual']
            }]
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page:ImportTC)")
            .return(`org`).end().send();
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
        resp[0].org.language[0].should.equals('de');
    });

    it('Import of not existing organization', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/organization', {
            organizations: [{
                uuid: '1', name: 'organization', description: 'description', slogan: 'slogan', website: 'www.link.org',
                language: 'de', categories: ['health', 'spiritual']
            }]
        });
        res.status.should.equal(200);
        let resp = await db.cypher().match("(org:Page:ImportTC)")
            .return(`org`).end().send();
        resp.length.should.equals(1);
        resp[0].org.title.should.equals('organization');
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
    });
});
