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
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {blogId: '1', visible: {visibility}, title: 'blogTitle', created: 506, text: 'blogText'})")
                .end({visibility: ['Freund']}).getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {blogId: '2', title: 'blogTitle2', created: 505, text: 'blogText2', heightPreviewImage: 400})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:WRITTEN]->(blog:Blog:PinwallElement {blogId: '3'})").end().getCommand());

            //Pages
            commands.push(db.cypher().create("(:Page {title: 'bookPage1Title', label: 'Book', description: 'bookPage1', language: 'de', created: 510, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'bookPage2Title', label: 'Book', description: 'bookPage2', language: 'de', created: 511, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'youtubePage1Title', label: 'Youtube', description: 'youtubePage1', language: 'de', created: 512, pageId: '2'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test.ch'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'youtubePage2Title', label: 'Youtube', description: 'youtubePage2', language: 'de', created: 513, pageId: '3'," +
                "author: 'Hans Muster', publishDate: 1000, link: 'www.test2.ch'})").end().getCommand());

            //Recommendations
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 505, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:Recommendation {recommendationId: '0'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '2'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 504, rating: 2, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:Recommendation {recommendationId: '1'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:User {userId: '1'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 504, rating: 4, comment: 'irgendwas3', recommendationId: '2'})-[:RECOMMENDS]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '2'}), (b:Recommendation {recommendationId: '2'})")
                .create("(b)-[:PINWALL_DATA]->(a)")
                .end().getCommand());
            commands.push(db.cypher().match("(a:Page {pageId: '3'}), (b:User {userId: '2'})")
                .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: 503, rating: 3, comment: 'irgendwas4', recommendationId: '3'})-[:RECOMMENDS]->(a)")
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

            res.body.pinwall.length.should.equal(4);

            res.body.pinwall[0].pinwallType.should.equals('Blog');
            res.body.pinwall[0].blogId.should.equals('1');
            res.body.pinwall[0].name.should.equals('user Meier');
            res.body.pinwall[0].userId.should.equals('1');
            res.body.pinwall[0].title.should.equals('blogTitle');
            res.body.pinwall[0].created.should.equals(506);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            should.not.exist(res.body.pinwall[0].url);
            should.not.exist(res.body.pinwall[0].urlFull);
            res.body.pinwall[0].text.should.equals('blogText');
            res.body.pinwall[0].isAdmin.should.equals(true);

            res.body.pinwall[1].pinwallType.should.equals('Blog');
            res.body.pinwall[1].blogId.should.equals('2');
            res.body.pinwall[1].name.should.equals('user Meier');
            res.body.pinwall[1].userId.should.equals('1');
            res.body.pinwall[1].title.should.equals('blogTitle2');
            res.body.pinwall[1].created.should.equals(505);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[1].url.should.equals('blog/2/preview.jpg');
            res.body.pinwall[1].urlFull.should.equals('blog/2/normal.jpg');
            res.body.pinwall[1].text.should.equals('blogText2');
            res.body.pinwall[1].isAdmin.should.equals(true);

            res.body.pinwall[2].pinwallType.should.equals('Recommendation');
            res.body.pinwall[2].label.should.equals('Book');
            res.body.pinwall[2].pageId.should.equals('0');
            res.body.pinwall[2].name.should.equals('user Meier');
            res.body.pinwall[2].userId.should.equals('1');
            res.body.pinwall[2].title.should.equals('bookPage1Title');
            res.body.pinwall[2].rating.should.equals(1);
            res.body.pinwall[2].created.should.equals(505);
            res.body.pinwall[2].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[2].url.should.equals('pages/0/pagePreview.jpg');
            res.body.pinwall[2].comment.should.equals('irgendwas');
            res.body.pinwall[2].description.should.equals('bookPage1');
            res.body.pinwall[2].isAdmin.should.equals(true);

            res.body.pinwall[3].pinwallType.should.equals('Recommendation');
            res.body.pinwall[3].label.should.equals('Youtube');
            res.body.pinwall[3].pageId.should.equals('2');
            res.body.pinwall[3].name.should.equals('user Meier');
            res.body.pinwall[3].userId.should.equals('1');
            res.body.pinwall[3].title.should.equals('youtubePage1Title');
            res.body.pinwall[3].rating.should.equals(4);
            res.body.pinwall[3].created.should.equals(504);
            res.body.pinwall[3].link.should.equals('www.test.ch');
            res.body.pinwall[3].comment.should.equals('irgendwas3');
            res.body.pinwall[3].description.should.equals('youtubePage1');
            res.body.pinwall[3].isAdmin.should.equals(true);
        });
    });

    it('Getting the pinwall of the user whit skip and maxItems - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.getWithData('/api/user/settings/profile/pinwall', {maxItems: 2, skip: 1}, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.pinwall.length.should.equal(2);

            res.body.pinwall[0].pinwallType.should.equals('Blog');
            res.body.pinwall[0].blogId.should.equals('2');
            res.body.pinwall[0].name.should.equals('user Meier');
            res.body.pinwall[0].userId.should.equals('1');
            res.body.pinwall[0].title.should.equals('blogTitle2');
            res.body.pinwall[0].created.should.equals(505);
            res.body.pinwall[0].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[0].url.should.equals('blog/2/preview.jpg');
            res.body.pinwall[0].urlFull.should.equals('blog/2/normal.jpg');
            res.body.pinwall[0].text.should.equals('blogText2');
            res.body.pinwall[0].isAdmin.should.equals(true);

            res.body.pinwall[1].pinwallType.should.equals('Recommendation');
            res.body.pinwall[1].label.should.equals('Book');
            res.body.pinwall[1].pageId.should.equals('0');
            res.body.pinwall[1].name.should.equals('user Meier');
            res.body.pinwall[1].userId.should.equals('1');
            res.body.pinwall[1].title.should.equals('bookPage1Title');
            res.body.pinwall[1].rating.should.equals(1);
            res.body.pinwall[1].created.should.equals(505);
            res.body.pinwall[1].profileUrl.should.equals('profileImage/1/thumbnail.jpg');
            res.body.pinwall[1].url.should.equals('pages/0/pagePreview.jpg');
            res.body.pinwall[1].comment.should.equals('irgendwas');
            res.body.pinwall[1].description.should.equals('bookPage1');
            res.body.pinwall[1].isAdmin.should.equals(true);
        });
    });
});
