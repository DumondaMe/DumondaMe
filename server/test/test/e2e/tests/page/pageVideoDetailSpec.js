'use strict';

var users = require('../util/user');
var db = require('../util/db');
var requestHandler = require('../util/request');

describe('Integration Tests for getting youtube page detail', function () {

    var requestAgent;

    beforeEach(function () {

        var commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            return db.cypher().create("(:Page {title: 'pageTitle', label: 'Youtube', description: 'page', language: 'de', link: 'www.link.com', " +
                "created: 500, modified: 501, pageId: '0'})").send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Getting the detail of the page for a youtube video', function () {

        var commands = [];

        commands.push(db.cypher().match("(u:User {userId: '1'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: false, image: false})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '3'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '2'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_CONTACT {type: 'Bekannter'}]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(u:User {userId: '2'})")
            .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: true, profileData: true, contacts: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true}), " +
            "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_AUTHOR]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_AUTHOR]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 1, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 500, rating: 4, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 501, rating: 4, comment: 'irgendwas3', recommendationId: '2'})-[:RECOMMENDS]->(a)")
            .end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_ADMIN]->(a)")
            .end().send(commands)
            .then(function () {
                return requestHandler.login(users.validUser);
            }).
            then(function (agent) {
                requestAgent = agent;
                return requestHandler.getWithData('/api/page/detail', {
                    pageId: '0',
                    label: 'Youtube'
                }, requestAgent);
            }).then(function (res) {
                res.status.should.equal(200);
                res.body.page.pageId.should.equals('0');
                res.body.page.title.should.equals('pageTitle');
                res.body.page.description.should.equals('page');
                res.body.page.language.should.equals('de');
                res.body.page.created.should.equals(500);
                res.body.page.modified.should.equals(501);
                res.body.page.link.should.equals('www.link.com');
                res.body.page.label.should.equals('Youtube');

                res.body.administrators.list.length.should.equals(2);
                res.body.administrators.list[0].name.should.equals('user Meier');
                res.body.administrators.list[0].userId.should.equals('1');
                res.body.administrators.list[0].profileUrl.should.equals('profileImage/1/profilePreview.jpg');
                res.body.administrators.list[1].name.should.equals('user Meier2');
                res.body.administrators.list[1].userId.should.equals('2');
                res.body.administrators.list[1].profileUrl.should.equals('profileImage/default/profilePreview.jpg');
                res.body.administrators.isAdmin.should.be.true;

                res.body.recommendation.user.profileUrl.should.equals('profileImage/1/thumbnail.jpg');
                res.body.recommendation.user.rating.should.equals(1);
                res.body.recommendation.user.comment.should.equals('irgendwas');
                res.body.recommendation.user.recommendationId.should.equals('0');

                res.body.recommendation.summary.contact.rating.should.equals(4);
                res.body.recommendation.summary.contact.numberOfRatings.should.equals(2);
                res.body.recommendation.summary.all.rating.should.equals(3);
                res.body.recommendation.summary.all.numberOfRatings.should.equals(3);
            });
    });
});
