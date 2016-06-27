'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var moment = require('moment');
var stubCDN = require('../../util/stubCDN');

describe('Integration Tests for deleting a page', function () {

    var requestAgent, startTime;

    beforeEach(function () {

        var commands = [];
        startTime = Math.floor(moment.utc().valueOf() / 1000);
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());

            commands.push(db.cypher().create("(:Page {title: 'page1Title', label: 'Book', description: 'page1', modified: 5090, pageId: '0'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'page2Title', label: 'Youtube', description: 'page2', modified: 5091, pageId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'page3Title', label: 'Youtube', description: 'page3', modified: 5092, pageId: '2'})").end().getCommand());

            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '1'})")
                .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '2'})")
                .create("(b)-[:IS_ADMIN]->(a)").end().getCommand());

            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, recommendationId: '1'})-[:RECOMMENDS]->(a)").end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '2'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, recommendationId: '2'})-[:RECOMMENDS]->(a)").end().getCommand());
            commands.push(db.cypher().match("(a:Recommendation {recommendationId: '1'}), (b:Page {pageId: '0'})")
                .create("(a)-[:PINWALL_DATA]->(b)").end().getCommand());
            commands.push(db.cypher().match("(a:Recommendation {recommendationId: '2'}), (b:Page {pageId: '1'})")
                .create("(a)-[:PINWALL_DATA]->(b)").end().getCommand());

            
            return db.cypher().create("(:User {name: 'user Meier5', userId: '5'})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Delete Successfully a page - Return 200', function () {

        stubCDN.deleteFolder.reset();
        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page', {pageId: '0'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            stubCDN.deleteFolder.calledWith("pages/0/").should.be.true;
            return db.cypher().match("(page:Page {pageId: '0'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(0);
            return db.cypher().match("(recommendation:Recommendation {recommendationId: '1'})")
                .return('recommendation').end().send();
        }).then(function (page) {
            page.length.should.equals(0);
        });
    });

    it('Delete a page failed because recommendation of other user exists - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page', {pageId: '1'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '1'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
            return db.cypher().match("(recommendation:Recommendation {recommendationId: '2'})")
                .return('recommendation').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
        });
    });

    it('Delete a page failed because user is not admin of page - Return 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.del('/api/user/page', {pageId: '2'}, requestAgent);
        }).then(function (res) {
            res.status.should.equal(400);
            return db.cypher().match("(page:Page {pageId: '2'})")
                .return('page').end().send();
        }).then(function (page) {
            page.length.should.equals(1);
        });
    });
    
});
