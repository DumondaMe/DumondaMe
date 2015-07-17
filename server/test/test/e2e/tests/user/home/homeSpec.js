'use strict';

var users = require('../../util/user');
var db = require('../../util/db');
var requestHandler = require('../../util/request');
var should = require('chai').should();

describe('Integration Tests for getting home screen information for a user', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().create("(:Page {title: 'bookPage1Title', label: 'Book', description: 'bookPage1', language: 'de', created: 501, pageId: '0'," +
                "author: 'Hans Muster', publishDate: 1000})").end().getCommand());
            return db.cypher().create("(:Page {title: 'bookPage2Title', label: 'Book', description: 'bookPage2', language: 'de', created: 501, pageId: '1'," +
                "author: 'Hans Muster', publishDate: 1000})").end().send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the last recommendations of the contacts', function () {

        var commands = [];

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true})")
            .end().getCommand());

        //Recommendations
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 502, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 501, rating: 4, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 4, comment: 'irgendwas3', recommendationId: '2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/user/home', {
                    skip: 0,
                    maxItems: 10
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);

                res.body.pinwall.length.should.equals(2);
                res.body.pinwall[0].label.should.equals('Book');
                res.body.pinwall[0].pageId.should.equals('0');
                res.body.pinwall[0].name.should.equals('user Meier2');
                res.body.pinwall[0].title.should.equals('bookPage1Title');
                res.body.pinwall[0].rating.should.equals(1);
                res.body.pinwall[0].created.should.equals(502);
                res.body.pinwall[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[0].url.should.equals('pages/0/pagePreview.jpg');
                res.body.pinwall[0].comment.should.equals('irgendwas');

                res.body.pinwall[1].label.should.equals('Book');
                res.body.pinwall[1].pageId.should.equals('1');
                res.body.pinwall[1].name.should.equals('user Meier2');
                res.body.pinwall[1].title.should.equals('bookPage2Title');
                res.body.pinwall[1].rating.should.equals(4);
                res.body.pinwall[1].created.should.equals(501);
                res.body.pinwall[1].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                res.body.pinwall[1].url.should.equals('pages/1/pagePreview.jpg');
                res.body.pinwall[1].comment.should.equals('irgendwas2');

            });
    });
});
