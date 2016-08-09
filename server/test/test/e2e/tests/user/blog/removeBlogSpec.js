'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var stubCDN = require('../../util/stubCDN');

describe('Integration Tests for removing a blog', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            return db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Remove a blog of the user', function () {

        var commands = [];

        stubCDN.deleteFolder.reset();

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:WRITTEN]->(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, pageId: '1', heightPreviewImage: 400})")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.del('/api/user/blog', {
                    pageId: '1'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                stubCDN.deleteFolder.calledWith("blog/1/").should.be.true;
                return db.cypher().match("(b:Blog)")
                    .return('b').end().send();
            }).then(function (blog) {
                blog.length.should.equals(0);
            });
    });

    it('Remove a blog of another user fails', function () {

        var commands = [];

        stubCDN.deleteFolder.reset();

        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:WRITTEN]->(:Blog:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, pageId: '1', heightPreviewImage: 400})")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.del('/api/user/blog', {
                    pageId: '1'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(400);
                stubCDN.deleteFolder.callCount.should.equals(0);
                return db.cypher().match("(b:Blog)")
                    .return('b').end().send();
            }).then(function (blog) {
                blog.length.should.equals(1);
            });
    });
});
