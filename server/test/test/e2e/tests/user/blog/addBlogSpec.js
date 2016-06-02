'use strict';

var users = require('../../util/user');
var generator = require('../../util/generator');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var sinon = require('sinon');
var moment = require('moment');
var _ = require('underscore');
var stubCDN = require('../../util/stubCDN');

describe('Integration Tests for adding a blog', function () {

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

    it('User adds a new blog without picture uploaded and with visibility public', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.post('/api/user/blog', {
                    addBlog: {
                        text: 'testBlog1',
                        topic: ['environmental', 'spiritual']
                    }
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                should.exist(res.body.blogId);
                res.body.text.should.equals("testBlog1");
                res.body.created.should.least(startTime);
                res.body.name.should.equals("user Meier");
                res.body.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                should.not.exist(res.body.heightPreviewImage);
                return db.cypher().match("(b:Blog:PinwallElement {text: 'testBlog1'})")
                    .return('b.text as text, b.created as created, b.topic AS topic')
                    .end().send();
            }).then(function (blog) {
                blog.length.should.equals(1);
                blog[0].text.should.equals('testBlog1');
                blog[0].created.should.least(startTime);
                blog[0].topic.length.should.equals(2);
                blog[0].topic[0].should.equals('environmental');
                blog[0].topic[1].should.equals('spiritual');
            });
    });

    it('User adds a new blog with landscape format picture uploaded and with visibility public', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        stubCDN.uploadFile.reset();

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.post('/api/user/blog', {
                    addBlog: {
                        text: 'testBlog1',
                        topic: ['environmental', 'spiritual']
                    }
                }, requestAgent, './test/test/e2e/tests/user/blog/testLandscape.jpg');
            }).then(function (res) {
                res.status.should.equal(200);
                should.exist(res.body.blogId);
                res.body.text.should.equals("testBlog1");
                res.body.created.should.least(startTime);
                res.body.name.should.equals("user Meier");
                res.body.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.url.should.equals('blog/' + res.body.blogId + '/preview.jpg');
                res.body.urlFull.should.equals('blog/' + res.body.blogId + '/normal.jpg');
                res.body.heightPreviewImage.should.equals(285);

                stubCDN.uploadFile.calledWith(sinon.match.any, "blog/" + res.body.blogId + "/preview.jpg").should.be.true;
                stubCDN.uploadFile.calledWith(sinon.match.any, "blog/" + res.body.blogId + "/normal.jpg").should.be.true;

                return db.cypher().match("(b:Blog:PinwallElement {text: 'testBlog1'})")
                    .return('b.text as text, b.created as created, b.heightPreviewImage as heightPreviewImage, b.topic as topic')
                    .end().send();
            }).then(function (blog) {
                blog.length.should.equals(1);
                blog[0].text.should.equals('testBlog1');
                blog[0].created.should.least(startTime);
                blog[0].topic.length.should.equals(2);
                blog[0].topic[0].should.equals('environmental');
                blog[0].topic[1].should.equals('spiritual');
            });
    });

    it('User adds a new blog with portrait format picture uploaded and with visibility public', function () {

        var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);

        stubCDN.uploadFile.reset();

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.post('/api/user/blog', {
                    addBlog: {
                        text: 'testBlog1',
                        topic: ['environmental', 'spiritual']
                    }
                }, requestAgent, './test/test/e2e/tests/user/blog/testPortrait.jpg');
            }).then(function (res) {
                res.status.should.equal(200);
                should.exist(res.body.blogId);
                res.body.text.should.equals("testBlog1");
                res.body.created.should.least(startTime);
                res.body.name.should.equals("user Meier");
                res.body.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.url.should.equals('blog/' + res.body.blogId + '/preview.jpg');
                res.body.urlFull.should.equals('blog/' + res.body.blogId + '/normal.jpg');
                res.body.heightPreviewImage.should.equals(1000);

                stubCDN.uploadFile.calledWith(sinon.match.any, "blog/" + res.body.blogId + "/preview.jpg").should.be.true;
                stubCDN.uploadFile.calledWith(sinon.match.any, "blog/" + res.body.blogId + "/normal.jpg").should.be.true;

                return db.cypher().match("(b:Blog:PinwallElement {text: 'testBlog1'})")
                    .return('b.text as text, b.created as created, b.topic as topic')
                    .end().send();
            }).then(function (blog) {
                blog.length.should.equals(1);
                blog[0].text.should.equals('testBlog1');
                blog[0].created.should.least(startTime);

                blog[0].topic.length.should.equals(2);
                blog[0].topic[0].should.equals('environmental');
                blog[0].topic[1].should.equals('spiritual');
            });
    });

    it('User adds a new blog without picture uploaded and with visibility only to group Freund and Bekannter', function () {

        var startTime = Math.floor(moment.utc().valueOf() / 1000);

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})," +
                "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
            .end().send()
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.post('/api/user/blog', {
                    addBlog: {
                        text: 'testBlog1',
                        visibility: ['Freund', 'Bekannter'],
                        topic: ['environmental', 'spiritual']
                    }
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                should.exist(res.body.blogId);
                res.body.text.should.equals("testBlog1");
                res.body.created.should.least(startTime);
                res.body.name.should.equals("user Meier");
                res.body.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                should.not.exist(res.body.url);
                should.not.exist(res.body.urlFull);
                return db.cypher().match("()-[:WRITTEN]->(b:Blog:PinwallElement {text: 'testBlog1'})")
                    .return('b.text as text, b.created as created, b.visible as visible, b.topic as topic')
                    .end().send();
            }).then(function (blog) {
                blog.length.should.equals(1);
                blog[0].text.should.equals('testBlog1');
                blog[0].visible.length.should.equals(2);
                blog[0].visible[0].should.equals('Freund');
                blog[0].visible[1].should.equals('Bekannter');
                blog[0].created.should.least(startTime);

                blog[0].topic.length.should.equals(2);
                blog[0].topic[0].should.equals('environmental');
                blog[0].topic[1].should.equals('spiritual');
            });
    });

    it('User adds a new blog with visibility which does not exists fails', function () {

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send()
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.post('/api/user/blog', {
                    addBlog: {
                        text: 'testBlog1',
                        visibility: ['Bekannter'],
                        topic: ['environmental', 'spiritual']
                    }
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(400);
                return db.cypher().match("(b:Blog)")
                    .return('b')
                    .end().send();
            }).then(function (blog) {
                blog.length.should.equals(0);
            });
    });

    it('More then 50 blog messages per hour per user causes an error', function () {

        var commands = [],
            ids = generator.generateIdArray(50),
            startTime = Math.floor(moment.utc().valueOf() / 1000) - 3500;

        _.each(ids, function (id) {
            commands.push(db.cypher().match("(user:User {userId: '1'})")
                .create("(user)-[:WRITTEN]->(blog:Blog {text: 'test', created: " + startTime + ", blogId: {blogId}})")
                .end({blogId: id}).getCommand());
        });

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.post('/api/user/blog', {
                    addBlog: {
                        text: 'testBlog1',
                        topic: ['environmental', 'spiritual']
                    }
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(400);
                return db.cypher().match("(b:Blog {text: 'testBlog1'})")
                    .return('b')
                    .end().send();
            }).then(function (blog) {
                blog.length.should.equals(0);
            });
    });

    it('More then 50 blog messages per hour per user with visibility causes an error', function () {

        var commands = [],
            ids = generator.generateIdArray(50),
            startTime = Math.floor(moment.utc().valueOf() / 1000) - 3500;

        _.each(ids, function (id) {
            commands.push(db.cypher().match("(user:User {userId: '1'})")
                .create("(user)-[:WRITTEN]->(blog:Blog {text: 'test', created: " + startTime + ", blogId: {blogId}})")
                .end({blogId: id}).getCommand());
        });

        return db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.post('/api/user/blog', {
                    addBlog: {
                        text: 'testBlog1',
                        visibility: ['Freund'],
                        topic: ['environmental', 'spiritual']
                    }
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(400);
                return db.cypher().match("(b:Blog {text: 'testBlog1'})")
                    .return('b')
                    .end().send();
            }).then(function (blog) {
                blog.length.should.equals(0);
            });
    });
});
