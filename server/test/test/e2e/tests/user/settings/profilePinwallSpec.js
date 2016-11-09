'use strict';

var libUser = require('../../../../../../lib/user')();
var users = require('../../util/user');
var requestHandler = require('../../util/request');
var should = require('chai').should();
var moment = require('moment');
var db = require('../../util/db');

describe('Integration Tests for getting the pinwall of the user', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        libUser.removeFromCache('userchange@irgendwo.ch');

        return db.clearDatabase().then(function () {

            var commands = [], startTime = Math.floor(moment.utc().valueOf() / 1000);
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());

            //Add Contacts
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
                .create("(u)-[:IS_CONTACT {type: 'Freund', contactAdded: {contactAdded}}]->(u2)")
                .end({contactAdded: startTime - 86401}).getCommand());

            //Add Blogs
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {pageId: '1', visible: {visibility}, title: 'blogTitle', created: 507, text: 'blogText', topic: {topic}})")
                .end({visibility: ['Freund'], topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {pageId: '2', title: 'blogTitle2', created: 506, text: 'blogText2', heightPreviewImage: 400, topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {pageId: '3', topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {pageId: '4', title: 'blogTitle4', created: 507, text: 'blogText4', heightPreviewImage: 200, topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());

            //Pages
            commands.push(db.cypher().create("(:Page {title: 'bookPage1Title', label: 'Book', description: 'bookPage1', language: 'de', created: 510, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000, topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'bookPage2Title', label: 'Book', description: 'bookPage2', language: 'de', created: 511, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000, topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'youtubePage1Title', label: 'Youtube', description: 'youtubePage1', language: 'de', created: 512, pageId: '2'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test.ch', topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());
            commands.push(db.cypher().create("(:Page {title: 'youtubePage2Title', label: 'Youtube', description: 'youtubePage2', language: 'de', created: 513, pageId: '3'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test2.ch', topic: {topic}})").end({topic: ['health', 'personalDevelopment']}).getCommand());

            //Recommendations Blogs
            commands.push(db.cypher().match("(a:Blog {pageId: '4'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 502, comment: 'irgendwas5', recommendationId: '10'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Blog {pageId: '4'}), (b:Recommendation {recommendationId: '10'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            
            //Recommendations Pages
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

    it('Getting the pinwall of the user - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/user/settings/profile/pinwall', {maxItems: 30, skip: 0}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(5);

            res.body.pinwall[0].pinwallType.should.equals('Blog');
            res.body.pinwall[0].pageId.should.equals('1');
            res.body.pinwall[0].name.should.equals('user Meier');
            res.body.pinwall[0].userId.should.equals('1');
            res.body.pinwall[0].title.should.equals('blogTitle');
            res.body.pinwall[0].created.should.equals(507);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            should.not.exist(res.body.pinwall[0].url);
            res.body.pinwall[0].text.should.equals('blogText');
            res.body.pinwall[0].recommendedByUser.should.equals(false);
            res.body.pinwall[0].isAdmin.should.equals(true);
            res.body.pinwall[0].isPublic.should.equals(false);
            res.body.pinwall[0].numberOfRecommendations.should.equals(0);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].pinwallType.should.equals('Blog');
            res.body.pinwall[1].pageId.should.equals('2');
            res.body.pinwall[1].name.should.equals('user Meier');
            res.body.pinwall[1].userId.should.equals('1');
            res.body.pinwall[1].title.should.equals('blogTitle2');
            res.body.pinwall[1].created.should.equals(506);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[1].url.should.equals('blog/2/preview.jpg');
            res.body.pinwall[1].text.should.equals('blogText2');
            res.body.pinwall[1].recommendedByUser.should.equals(false);
            res.body.pinwall[1].isAdmin.should.equals(true);
            res.body.pinwall[1].isPublic.should.equals(true);
            res.body.pinwall[1].numberOfRecommendations.should.equals(0);
            res.body.pinwall[1].topic.length.should.equals(2);
            res.body.pinwall[1].topic[0].should.equals('health');
            res.body.pinwall[1].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals('Book');
            res.body.pinwall[2].pageId.should.equals('0');
            res.body.pinwall[2].name.should.equals('user Meier');
            res.body.pinwall[2].userId.should.equals('1');
            res.body.pinwall[2].title.should.equals('bookPage1Title');
            res.body.pinwall[2].created.should.equals(505);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[2].description.should.equals('bookPage1');
            res.body.pinwall[2].recommendedByUser.should.equals(true);
            res.body.pinwall[2].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[2].userRecommendationId.should.equals('0');
            res.body.pinwall[2].numberOfRecommendations.should.equals(1);
            res.body.pinwall[2].topic.length.should.equals(2);
            res.body.pinwall[2].topic[0].should.equals('health');
            res.body.pinwall[2].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals('Youtube');
            res.body.pinwall[3].pageId.should.equals('2');
            res.body.pinwall[3].name.should.equals('user Meier');
            res.body.pinwall[3].userId.should.equals('1');
            res.body.pinwall[3].title.should.equals('youtubePage1Title');
            res.body.pinwall[3].created.should.equals(504);
            res.body.pinwall[3].description.should.equals('youtubePage1');
            res.body.pinwall[3].recommendedByUser.should.equals(true);
            res.body.pinwall[3].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[3].numberOfRecommendations.should.equals(1);
            res.body.pinwall[3].userRecommendationId.should.equals('2');
            res.body.pinwall[3].topic.length.should.equals(2);
            res.body.pinwall[3].topic[0].should.equals('health');
            res.body.pinwall[3].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[4].pinwallType.should.equals('Recommendation');
            res.body.pinwall[4].label.should.equals('Blog');
            res.body.pinwall[4].pageId.should.equals('4');
            res.body.pinwall[4].writerName.should.equals('user Meier2');
            res.body.pinwall[4].writerUserId.should.equals('2');
            res.body.pinwall[4].name.should.equals('user Meier');
            res.body.pinwall[4].userId.should.equals('1');
            res.body.pinwall[4].recommendedByUser.should.equals(true);
            res.body.pinwall[4].thisRecommendationByUser.should.equals(true);
            res.body.pinwall[4].userRecommendationId.should.equals('10');
            res.body.pinwall[4].created.should.equals(502);
            res.body.pinwall[4].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[4].heightPreviewImage.should.equals(200);
            res.body.pinwall[4].url.should.equals('blog/4/preview.jpg');
            res.body.pinwall[4].text.should.equals('blogText4');
            res.body.pinwall[4].isAdmin.should.equals(false);
            res.body.pinwall[4].topic.length.should.equals(2);
            res.body.pinwall[4].topic[0].should.equals('health');
            res.body.pinwall[4].topic[1].should.equals('personalDevelopment');
            res.body.pinwall[4].numberOfRecommendations.should.equals(1);
        });
    });

    it('Getting the pinwall of the user whit skip and maxItems - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/user/settings/profile/pinwall', {maxItems: 2, skip: 1}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(2);

            res.body.pinwall[0].pinwallType.should.equals('Blog');
            res.body.pinwall[0].pageId.should.equals('2');
            res.body.pinwall[0].name.should.equals('user Meier');
            res.body.pinwall[0].userId.should.equals('1');
            res.body.pinwall[0].title.should.equals('blogTitle2');
            res.body.pinwall[0].created.should.equals(506);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[0].url.should.equals('blog/2/preview.jpg');
            res.body.pinwall[0].text.should.equals('blogText2');
            res.body.pinwall[0].isAdmin.should.equals(true);
            res.body.pinwall[0].isPublic.should.equals(true);
            res.body.pinwall[0].topic.length.should.equals(2);
            res.body.pinwall[0].topic[0].should.equals('health');
            res.body.pinwall[0].topic[1].should.equals('personalDevelopment');

            res.body.pinwall[1].pinwallType.should.equals('Recommendation');
            res.body.pinwall[1].label.should.equals('Book');
            res.body.pinwall[1].pageId.should.equals('0');
            res.body.pinwall[1].name.should.equals('user Meier');
            res.body.pinwall[1].userId.should.equals('1');
            res.body.pinwall[1].title.should.equals('bookPage1Title');
            res.body.pinwall[1].created.should.equals(505);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[1].description.should.equals('bookPage1');
            res.body.pinwall[1].topic.length.should.equals(2);
            res.body.pinwall[1].topic[0].should.equals('health');
            res.body.pinwall[1].topic[1].should.equals('personalDevelopment');
        });
    });
});
