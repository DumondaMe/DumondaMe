'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');

describe('Integration Tests for getting recommended blogs on home screen for a user', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', forename:'user', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', forename:'user', userId: '3'})").end().getCommand());
            return db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });
    

    it('Showing latest blog recommendation of contact when user is writer of blog', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', title: 'blogTitle1', created: 501, blogId: '1', heightPreviewImage: 200, " +
            "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '1'})")
            .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '1', created: 503, comment: 'test'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '3'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '2', created: 502, comment: 'test2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '2'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '4'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '3', created: 502, comment: 'test3'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '3'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());

        commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1','2','3']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {pinwall: true, profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {pinwall: true, profile: true, image: true})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '3'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(2);
                res.body.pinwall[0].pinwallType.should.equals('Recommendation');
                res.body.pinwall[0].label.should.equals('Blog');
                res.body.pinwall[0].blogId.should.equals('1');
                res.body.pinwall[0].writerName.should.equals('user Meier');
                res.body.pinwall[0].writerUserId.should.equals('1');
                res.body.pinwall[0].name.should.equals('user Meier2');
                res.body.pinwall[0].userId.should.equals('2');
                res.body.pinwall[0].recommendedByUser.should.equals(false);
                res.body.pinwall[0].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[0].created.should.equals(503);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[0].heightPreviewImage.should.equals(200);
                res.body.pinwall[0].url.should.equals('blog/1/preview.jpg');
                res.body.pinwall[0].urlFull.should.equals('blog/1/normal.jpg');
                res.body.pinwall[0].title.should.equals('blogTitle1');
                res.body.pinwall[0].text.should.equals('blogText1');
                res.body.pinwall[0].isAdmin.should.equals(true);
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('health');
                res.body.pinwall[0].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[0].numberOfRecommendations.should.equals(3);

                res.body.pinwall[1].pinwallType.should.equals('Blog');
                res.body.pinwall[1].blogId.should.equals('1');
                res.body.pinwall[1].name.should.equals('user Meier');
                res.body.pinwall[1].forename.should.equals('user');
                res.body.pinwall[1].userId.should.equals('1');
                res.body.pinwall[1].created.should.equals(501);
                res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.pinwall[1].heightPreviewImage.should.equals(200);
                res.body.pinwall[1].url.should.equals('blog/1/preview.jpg');
                res.body.pinwall[1].urlFull.should.equals('blog/1/normal.jpg');
                res.body.pinwall[1].title.should.equals('blogTitle1');
                res.body.pinwall[1].text.should.equals('blogText1');
                res.body.pinwall[1].isAdmin.should.equals(true);
                res.body.pinwall[1].isPublic.should.equals(true);
                res.body.pinwall[1].topic.length.should.equals(2);
                res.body.pinwall[1].topic[0].should.equals('health');
                res.body.pinwall[1].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[1].numberOfRecommendations.should.equals(3);
                res.body.pinwall[1].recommendedByUser.should.equals(false);
            });
    });

    it('Showing latest blog recommendation of contact when user is not writer of blog', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', title: 'blogTitle1', created: 501, blogId: '1', heightPreviewImage: 200, " +
            "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());
        
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '1'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '1', created: 503, comment: 'test'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '3'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '2', created: 504, comment: 'test2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '2'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());

        commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1','2','3']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {pinwall: true, profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {pinwall: true, profile: true, image: true})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '3'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(2);
                res.body.pinwall[0].pinwallType.should.equals('Recommendation');
                res.body.pinwall[0].label.should.equals('Blog');
                res.body.pinwall[0].blogId.should.equals('1');
                res.body.pinwall[0].writerName.should.equals('user Meier2');
                res.body.pinwall[0].writerUserId.should.equals('2');
                res.body.pinwall[0].name.should.equals('user Meier3');
                res.body.pinwall[0].userId.should.equals('3');
                res.body.pinwall[0].recommendedByUser.should.equals(true);
                res.body.pinwall[0].thisRecommendationByUser.should.equals(false);
                res.body.pinwall[0].userRecommendationId.should.equals('1');
                res.body.pinwall[0].created.should.equals(504);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
                res.body.pinwall[0].heightPreviewImage.should.equals(200);
                res.body.pinwall[0].url.should.equals('blog/1/preview.jpg');
                res.body.pinwall[0].urlFull.should.equals('blog/1/normal.jpg');
                res.body.pinwall[0].text.should.equals('blogText1');
                res.body.pinwall[0].title.should.equals('blogTitle1');
                res.body.pinwall[0].isAdmin.should.equals(false);
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('health');
                res.body.pinwall[0].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[0].numberOfRecommendations.should.equals(2);

                res.body.pinwall[1].pinwallType.should.equals('Blog');
                res.body.pinwall[1].blogId.should.equals('1');
                res.body.pinwall[1].name.should.equals('user Meier2');
                res.body.pinwall[1].forename.should.equals('user');
                res.body.pinwall[1].userId.should.equals('2');
                res.body.pinwall[1].created.should.equals(501);
                res.body.pinwall[1].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[1].heightPreviewImage.should.equals(200);
                res.body.pinwall[1].url.should.equals('blog/1/preview.jpg');
                res.body.pinwall[1].urlFull.should.equals('blog/1/normal.jpg');
                res.body.pinwall[1].title.should.equals('blogTitle1');
                res.body.pinwall[1].text.should.equals('blogText1');
                res.body.pinwall[1].isAdmin.should.equals(false);
                res.body.pinwall[1].isPublic.should.equals(true);
                res.body.pinwall[1].topic.length.should.equals(2);
                res.body.pinwall[1].topic[0].should.equals('health');
                res.body.pinwall[1].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[1].numberOfRecommendations.should.equals(2);
                res.body.pinwall[1].recommendedByUser.should.equals(true);
                res.body.pinwall[1].userRecommendationId.should.equals('1');
            });
    });

    it('Showing blog recommended by user', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', title: 'blogTitle1', created: 501, blogId: '1', heightPreviewImage: 200, " +
            "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());

        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '1'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '1', created: 503, comment: 'test'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());

        commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1','2','3']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {pinwall: true, profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {pinwall: true, profile: true, image: true})").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)").end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(1);
                res.body.pinwall[0].pinwallType.should.equals('Recommendation');
                res.body.pinwall[0].label.should.equals('Blog');
                res.body.pinwall[0].blogId.should.equals('1');
                res.body.pinwall[0].writerName.should.equals('user Meier2');
                res.body.pinwall[0].writerUserId.should.equals('2');
                res.body.pinwall[0].name.should.equals('user Meier');
                res.body.pinwall[0].userId.should.equals('1');
                res.body.pinwall[0].recommendedByUser.should.equals(true);
                res.body.pinwall[0].thisRecommendationByUser.should.equals(true);
                res.body.pinwall[0].userRecommendationId.should.equals('1');
                res.body.pinwall[0].created.should.equals(503);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.pinwall[0].heightPreviewImage.should.equals(200);
                res.body.pinwall[0].url.should.equals('blog/1/preview.jpg');
                res.body.pinwall[0].urlFull.should.equals('blog/1/normal.jpg');
                res.body.pinwall[0].title.should.equals('blogTitle1');
                res.body.pinwall[0].text.should.equals('blogText1');
                res.body.pinwall[0].isAdmin.should.equals(false);
                res.body.pinwall[0].topic.length.should.equals(2);
                res.body.pinwall[0].topic[0].should.equals('health');
                res.body.pinwall[0].topic[1].should.equals('personalDevelopment');
                res.body.pinwall[0].numberOfRecommendations.should.equals(1);
            });
    });

    it('Not showing blog recommendation when user is not included in visible group', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', created: 501, blogId: '1', heightPreviewImage: 200, " +
            "topic: {topic}, visible: {visible}})").end({topic: ['health', 'personalDevelopment'], visible: ['Freund']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '3'})")
            .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());
        
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '1', created: 503, comment: 'test'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());

        commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1','2','3']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {pinwall: true, profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {pinwall: true, profile: true, image: true})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when contact HAS_PRIVACY_NO_CONTACT pinwall is set to false', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', created: 501, blogId: '1', heightPreviewImage: 200, " +
            "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '3'})")
            .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '1', created: 503, comment: 'test'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());

        commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1','2','3']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {pinwall: false, profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {pinwall: true, profile: true, image: true})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when contact HAS_PRIVACY pinwall is set to false', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', created: 501, blogId: '1', heightPreviewImage: 200, " +
            "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '3'})")
            .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '1', created: 503, comment: 'test'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());

        commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1','2','3']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {pinwall: true, profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {pinwall: false, profile: true, image: true})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when user is blocked by contact', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', created: 501, blogId: '1', heightPreviewImage: 200, " +
            "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '3'})")
            .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '1', created: 503, comment: 'test'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());

        commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1','2','3']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {pinwall: true, profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {pinwall: true, profile: true, image: true})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());
        
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_BLOCKED]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });

    it('Not showing blog recommendation when user is blocked by writer of the blog', function () {

        var commands = [];

        commands.push(db.cypher().create("(:Blog:PinwallElement {text: 'blogText1', created: 501, blogId: '1', heightPreviewImage: 200, " +
            "topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '3'})")
            .createUnique("(b)-[:WRITTEN]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '2'})")
            .createUnique("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {recommendationId: '1', created: 503, comment: 'test'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '1'})")
            .create("(b)-[:PINWALL_DATA]->(a)").end().getCommand());

        commands.push(db.cypher().match("(u:User)").where("u.userId IN ['1','2','3']")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {pinwall: true, profile: true, image: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {pinwall: true, profile: true, image: true})").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund', contactAdded: '400'}]->(a)").end().getCommand());

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_BLOCKED]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skipBlog: 0,
                    skipRecommendation: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(0);
            });
    });
});
