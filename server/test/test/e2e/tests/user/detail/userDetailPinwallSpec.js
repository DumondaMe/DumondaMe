'use strict';

var libUser = require('../../../../../../lib/user')();
var users = require('../../util/user');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');
var db = require('../../util/db');

describe('Integration Tests for getting the pinwall of another user', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        libUser.removeFromCache('userchange@irgendwo.ch');

        return db.clearDatabase().then(function () {

            var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());

            //Add Contacts
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime - 86401}).getCommand());

            //Add Blogs
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {blogId: '1', visible: {visibility}, topic: {topic}, title: 'blogTitle', created: 506, text: 'blogText'})")
                .end({visibility: ['Freund'], topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {blogId: '2', title: 'blogTitle2', created: 505, text: 'blogText2', heightPreviewImage: 400, topic: {topic}})").end({topic: ['health', 'spiritual']}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {blogId: '3', topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {blogId: '4', title: 'blogTitle4', created: 502, text: 'blogText4', heightPreviewImage: 200, topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());

            //Pages
            commands.push(db.cypher().create("(:Page {title: 'bookPage1Title', label: 'Book', description: 'bookPage1', created: 510, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000, topic: {topic}})").end({topic: ['health', 'environmental']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'bookPage2Title', label: 'Book', description: 'bookPage2', created: 511, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000, topic: {topic}})").end({topic: ['health', 'spiritual']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'youtubePage1Title', label: 'Youtube', description: 'youtubePage1', created: 512, pageId: '2'," +
                "link: 'www.test.ch', topic: {topic}})").end({topic: ['education', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'youtubePage2Title', label: 'Youtube', description: 'youtubePage2', created: 513, pageId: '3'," +
                "link: 'www.test2.ch', topic: {topic}})").end({topic: ['socialDevelopment', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'linkPageTitle', label: 'Link', description: 'linkPage', created: 514, pageId: '4'," +
                "link: 'www.host.com/test', hostname: 'www.host.com', heightPreviewImage: 200, topic: {topic}})").end({topic: ['socialDevelopment', 'personalDevelopment']}).getCommand());

            //Recommendation Blogs
            commands.push(db.cypher().match("(a:Blog {blogId: '4'}), (b:User {userId: '2'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 508, comment: 'irgendwas', recommendationId: '10'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Blog {blogId: '4'}), (b:Recommendation {recommendationId: '10'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 509, comment: 'irgendwas', recommendationId: '11'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Blog {blogId: '1'}), (b:Recommendation {recommendationId: '11'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());

            //Recommendation Pages
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 505, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '2'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 504, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:Recommendation {recommendationId: '1'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 504, comment: 'irgendwas3', recommendationId: '2'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:Recommendation {recommendationId: '2'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '3'}), (b:User {userId: '2'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, comment: 'irgendwas4', recommendationId: '3'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '3'}), (b:Recommendation {recommendationId: '3'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '4'}), (b:User {userId: '2'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 502, comment: 'irgendwas5', recommendationId: '4'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '4'}), (b:Recommendation {recommendationId: '4'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '4'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 501, comment: 'irgendwas6', recommendationId: '5'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '4'}), (b:Recommendation {recommendationId: '5'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());

            //Create Privacy
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, profileData: true, contacts: false, image: true})")
                .end().getCommand());
            return db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, profileData: false, contacts: false, image: false})")
                .end().send(commands)
                .catch(function (err) {
                    var test = err;
                });
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the pinwall of another user - Return a 200', function () {
        var commands = [];
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, profileData: true, contacts: true, image: true, pinwall: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, profileData: true, contacts: true, image: true, pinwall: false})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'}), (u2:User {userId: '1'})")
            .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: '500'}]->(u2)")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})")
            .return('u')
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pinwall.length.should.equal(6);

                    res.body.pinwall[0].pinwallType.should.equals('Recommendation');
                    res.body.pinwall[0].label.should.equals('Blog');
                    res.body.pinwall[0].blogId.should.equals('4');
                    res.body.pinwall[0].writerName.should.equals('user Meier');
                    res.body.pinwall[0].writerUserId.should.equals('1');
                    res.body.pinwall[0].name.should.equals('user Meier2');
                    res.body.pinwall[0].userId.should.equals('2');
                    res.body.pinwall[0].recommendedByUser.should.equals(false);
                    res.body.pinwall[0].thisRecommendationByUser.should.equals(false);
                    res.body.pinwall[0].created.should.equals(508);
                    res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                    res.body.pinwall[0].heightPreviewImage.should.equals(200);
                    res.body.pinwall[0].url.should.equals('blog/4/preview.jpg');
                    res.body.pinwall[0].urlFull.should.equals('blog/4/normal.jpg');
                    res.body.pinwall[0].text.should.equals('blogText4');
                    res.body.pinwall[0].isAdmin.should.equals(true);
                    res.body.pinwall[0].topic.length.should.equals(2);
                    res.body.pinwall[0].topic[0].should.equals('health');
                    res.body.pinwall[0].topic[1].should.equals('personalDevelopment');
                    res.body.pinwall[0].numberOfRecommendations.should.equals(1);

                    res.body.pinwall[1].pinwallType.should.equals('Blog');
                    res.body.pinwall[1].blogId.should.equals('1');
                    res.body.pinwall[1].name.should.equals('user Meier2');
                    res.body.pinwall[1].userId.should.equals('2');
                    res.body.pinwall[1].title.should.equals('blogTitle');
                    res.body.pinwall[1].created.should.equals(506);
                    res.body.pinwall[1].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                    should.not.exist(res.body.pinwall[1].url);
                    should.not.exist(res.body.pinwall[1].urlFull);
                    res.body.pinwall[1].text.should.equals('blogText');
                    res.body.pinwall[1].isAdmin.should.equals(false);
                    res.body.pinwall[1].isPublic.should.equals(false);
                    res.body.pinwall[1].recommendedByUser.should.equals(true);
                    res.body.pinwall[1].userRecommendationId.should.equals('11');
                    res.body.pinwall[1].numberOfRecommendations.should.equals(1);
                    res.body.pinwall[1].topic.length.should.equals(2);
                    res.body.pinwall[1].topic[0].should.equals('health');
                    res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

                    res.body.pinwall[2].pinwallType.should.equals('Blog');
                    res.body.pinwall[2].blogId.should.equals('2');
                    res.body.pinwall[2].name.should.equals('user Meier2');
                    res.body.pinwall[2].userId.should.equals('2');
                    res.body.pinwall[2].title.should.equals('blogTitle2');
                    res.body.pinwall[2].created.should.equals(505);
                    res.body.pinwall[2].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                    res.body.pinwall[2].url.should.equals('blog/2/preview.jpg');
                    res.body.pinwall[2].urlFull.should.equals('blog/2/normal.jpg');
                    res.body.pinwall[2].text.should.equals('blogText2');
                    res.body.pinwall[2].recommendedByUser.should.equals(false);
                    res.body.pinwall[2].numberOfRecommendations.should.equals(0);
                    res.body.pinwall[2].isAdmin.should.equals(false);
                    res.body.pinwall[2].isPublic.should.equals(true);
                    res.body.pinwall[2].topic.length.should.equals(2);
                    res.body.pinwall[2].topic[0].should.equals('health');
                    res.body.pinwall[2].topic[1].should.equals('spiritual');

                    res.body.pinwall[3].pinwallType.should.equals('Recommendation');
                    res.body.pinwall[3].label.should.equals('Book');
                    res.body.pinwall[3].pageId.should.equals('1');
                    res.body.pinwall[3].name.should.equals('user Meier2');
                    res.body.pinwall[3].userId.should.equals('2');
                    res.body.pinwall[3].title.should.equals('bookPage2Title');
                    res.body.pinwall[3].created.should.equals(504);
                    res.body.pinwall[3].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                    res.body.pinwall[3].comment.should.equals('irgendwas2');
                    res.body.pinwall[3].description.should.equals('bookPage2');
                    res.body.pinwall[3].recommendedByUser.should.equals(false);
                    res.body.pinwall[3].thisRecommendationByUser.should.equals(false);
                    res.body.pinwall[3].numberOfRecommendations.should.equals(1);
                    res.body.pinwall[3].topic.length.should.equals(2);
                    res.body.pinwall[3].topic[0].should.equals('health');
                    res.body.pinwall[3].topic[1].should.equals('spiritual');

                    res.body.pinwall[4].pinwallType.should.equals('Recommendation');
                    res.body.pinwall[4].label.should.equals('Youtube');
                    res.body.pinwall[4].pageId.should.equals('3');
                    res.body.pinwall[4].name.should.equals('user Meier2');
                    res.body.pinwall[4].userId.should.equals('2');
                    res.body.pinwall[4].title.should.equals('youtubePage2Title');
                    res.body.pinwall[4].created.should.equals(503);
                    res.body.pinwall[4].comment.should.equals('irgendwas4');
                    res.body.pinwall[4].description.should.equals('youtubePage2');
                    res.body.pinwall[4].recommendedByUser.should.equals(false);
                    res.body.pinwall[4].thisRecommendationByUser.should.equals(false);
                    res.body.pinwall[4].numberOfRecommendations.should.equals(1);
                    res.body.pinwall[4].topic.length.should.equals(2);
                    res.body.pinwall[4].topic[0].should.equals('socialDevelopment');
                    res.body.pinwall[4].topic[1].should.equals('personalDevelopment');

                    res.body.pinwall[5].pinwallType.should.equals('Recommendation');
                    res.body.pinwall[5].label.should.equals('Link');
                    res.body.pinwall[5].pageId.should.equals('4');
                    res.body.pinwall[5].name.should.equals('user Meier2');
                    res.body.pinwall[5].link.should.equals('www.host.com/test');
                    res.body.pinwall[5].hostname.should.equals('www.host.com');
                    res.body.pinwall[5].userId.should.equals('2');
                    res.body.pinwall[5].title.should.equals('linkPageTitle');
                    res.body.pinwall[5].created.should.equals(502);
                    res.body.pinwall[5].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                    res.body.pinwall[5].linkPreviewUrl.should.equals('pages/4/preview.jpg');
                    res.body.pinwall[5].heightPreviewImage.should.equals(200);
                    res.body.pinwall[5].comment.should.equals('irgendwas5');
                    res.body.pinwall[5].description.should.equals('linkPage');
                    res.body.pinwall[5].recommendedByUser.should.equals(true);
                    res.body.pinwall[5].thisRecommendationByUser.should.equals(false);
                    res.body.pinwall[5].userRecommendationId.should.equals('5');
                    res.body.pinwall[5].numberOfRecommendations.should.equals(2);
                    res.body.pinwall[5].topic.length.should.equals(2);
                    res.body.pinwall[5].topic[0].should.equals('socialDevelopment');
                    res.body.pinwall[5].topic[1].should.equals('personalDevelopment');
                });
            });
    });

    it('Privacy setting for this group allows only to show public blogs - Return a 200', function () {
        var commands = [];
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY {type: 'Freund2'}]->(:Privacy {profile: true, profileData: true, contacts: true, image: true, pinwall: false})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, profileData: true, contacts: true, image: true, pinwall: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'}), (u2:User {userId: '1'})")
            .create("(u)-[:IS_CONTACT {type: 'Freund2', contactAdded: '500'}]->(u2)")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})")
            .return('u')
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pinwall.length.should.equal(1);
                    res.body.pinwall[0].pinwallType.should.equals('Blog');
                    res.body.pinwall[0].blogId.should.equals('2');
                });
            });
    });

    it('Privacy setting for profile allows only to show public blogs - Return a 200', function () {
        var commands = [];
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY {type: 'Freund2'}]->(:Privacy {profile: false, profileData: true, contacts: true, image: true, pinwall: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, profileData: true, contacts: true, image: true, pinwall: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'}), (u2:User {userId: '1'})")
            .create("(u)-[:IS_CONTACT {type: 'Freund2', contactAdded: '500'}]->(u2)")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})")
            .return('u')
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pinwall.length.should.equal(1);
                    res.body.pinwall[0].pinwallType.should.equals('Blog');
                    res.body.pinwall[0].blogId.should.equals('2');
                });
            });
    });

    it('Privacy setting when no contact allows only to show public blogs - Return a 200', function () {
        var commands = [];
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, profileData: true, contacts: true, image: true, pinwall: false})")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})")
            .return('u')
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pinwall.length.should.equal(1);
                    res.body.pinwall[0].pinwallType.should.equals('Blog');
                    res.body.pinwall[0].blogId.should.equals('2');
                });
            });
    });

    it('Privacy setting profile for no contact allows only to show public blogs - Return a 200', function () {
        var commands = [];
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, profileData: true, contacts: true, image: true, pinwall: true})")
            .end().getCommand());

        return db.cypher().match("(u:User {userId: '2'})")
            .return('u')
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '2', maxItems: 30, skip: 0}, agent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.pinwall.length.should.equal(1);
                    res.body.pinwall[0].pinwallType.should.equals('Blog');
                    res.body.pinwall[0].blogId.should.equals('2');
                });
            });
    });

    it('Same user Id as for user is invalid - Return a 400', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/user/detail/pinwall', {userId: '1', maxItems: 30, skip: 0}, agent);
        }).then(function (res) {
            res.status.should.equal(400);
        });
    });
});
