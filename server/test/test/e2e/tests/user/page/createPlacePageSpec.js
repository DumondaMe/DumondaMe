'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');
var stubCDN = require('../../util/stubCDN');

describe('Integration Tests for creating new place pages', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        stubCDN.uploadFile.reset();
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());

            return db.cypher().create("(:User {name: 'user Meier5', userId: '5'})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Create a new place page - Return 200', function () {

        var createPage = {
            placePage: {
                title: 'title',
                places: [{description: 'addressName', lat: -5.00, lng: 6.00}]
            }
        }, pageId;

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.post('/api/user/page/create', createPage, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            pageId = res.body.pageId;
            return db.cypher().match("(address:Address)<-[:HAS]-(page:Page {title: 'title'})<-[:IS_ADMIN]-(:User {userId: '1'})")
                .return(`page.pageId AS pageId, page.label AS label, page.modified AS modified, page.created AS created,
                         address.description AS address, address.lat AS lat, address.lng AS lng`)
                .end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            page[0].created.should.be.at.least(startTime);
            page[0].modified.should.be.at.least(startTime);
            page[0].label.should.equals("Place");
            page[0].pageId.should.equals(pageId);
            page[0].address.should.equals("addressName");
            page[0].lat.should.equals(-5.00);
            page[0].lng.should.equals(6.00);
        });
    });
});
