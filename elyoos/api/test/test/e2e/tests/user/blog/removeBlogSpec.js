'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let stubCDN = require('elyoos-server-test-util').stubCDN();

describe('Integration Tests for removing a blog', function () {

    beforeEach(function () {

        let commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            return db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Remove a blog of the user with recommendations', function () {

        let commands = [];

        stubCDN.deleteFolder.reset();

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:WRITTEN]->(:Blog:Page:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, pageId: '1', heightPreviewImage: 400})")
            .end().getCommand());

        commands.push(db.cypher().match("(u:User {userId: '2'}), (blog:Blog {pageId: '1'})")
            .create("(u)-[:RECOMMENDS]->(:Recommendation {recommendationId: '1'})-[:RECOMMENDS]->(blog)")
            .end().getCommand());
        commands.push(db.cypher().match("(recommendation:Recommendation {recommendationId: '1'}), (blog:Blog {pageId: '1'})")
            .create("(recommendation)-[:PINWALL_DATA]->(blog)")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function () {
                return requestHandler.del('/api/user/blog', {
                    pageId: '1'
                });
            }).then(function (res) {
                res.status.should.equal(200);
                stubCDN.deleteFolder.calledWith("blog/1/").should.be.true;
                return db.cypher().match("(b:Blog)")
                    .return('b').end().send();
            }).then(function (blog) {
                blog.length.should.equals(0);
            });
    });

    it('Remove a blog of the user without recommendations', function () {

        let commands = [];

        stubCDN.deleteFolder.reset();

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:WRITTEN]->(:Blog:Page:PinwallElement {title: 'blogTitle1', text: 'blogText1', created: 501, pageId: '1', heightPreviewImage: 400})")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function () {
                return requestHandler.del('/api/user/blog', {
                    pageId: '1'
                });
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

        let commands = [];

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
            then(function () {
                return requestHandler.del('/api/user/blog', {
                    pageId: '1'
                });
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