'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting page comments', function () {

    let requestAgent;

    beforeEach(function () {

        let commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', surname: 'Meier', forename:'user', userId: '1'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier2', userId: '2'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '2'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier3', userId: '3'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '3'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier4', userId: '4'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '4'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: true})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier5', userId: '5'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '5'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: false})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier6', userId: '6'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '6'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {name: 'user Meier7', userId: '7'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '7'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: true, image: true, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: false, image: false})")
                .end().getCommand());

            commands.push(db.cypher().create("(:User {name: 'user Meier8', userId: '8'})")
                .end().getCommand());
            return db.cypher().match("(u:User {userId: '8'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false, profileData: true, contacts: true}), " +
                "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    // Sorted by when the recommendation was added
    it('Getting only contact comments for a book recommendation - Return 200', function () {

        let commands = [];

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '4'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '5'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '6'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '7'})")
            .create("(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label:'Book', language: 'de', description: 'page1', modified: 5072, pageId: '0'})").end().getCommand());

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 510, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 509, comment: 'irgendwas2', recommendationId: '1'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, comment: 'irgendwas3', recommendationId: '2'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '5'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, comment: 'irgendwas4', recommendationId: '3'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '6'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 506, comment: 'irgendwas5', recommendationId: '4'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '7'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 505, comment: 'irgendwas6', recommendationId: '5'})-[:RECOMMENDS]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '8'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 511, comment: 'irgendwas7', recommendationId: '6'})-[:RECOMMENDS]->(a)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/comments', {
                        skip: '0',
                        maxItems: 10,
                        onlyContacts: true,
                        pageId: '0'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.totalNumberOfComments.should.equals(6);
                    res.body.comments.length.should.equals(6);

                    res.body.comments[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                    res.body.comments[0].name.should.equals('user Meier2');
                    res.body.comments[0].comment.should.equals('irgendwas');
                    res.body.comments[0].created.should.equals(510);

                    res.body.comments[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                    res.body.comments[1].name.should.equals('user Meier3');
                    res.body.comments[1].comment.should.equals('irgendwas2');
                    res.body.comments[1].created.should.equals(509);

                    res.body.comments[2].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                    res.body.comments[2].name.should.equals('user Meier4');
                    res.body.comments[2].comment.should.equals('irgendwas3');
                    res.body.comments[2].created.should.equals(508);

                    res.body.comments[3].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                    res.body.comments[3].name.should.equals('user Meier5');
                    res.body.comments[3].comment.should.equals('irgendwas4');
                    res.body.comments[3].created.should.equals(507);

                    res.body.comments[4].profileUrl.should.equals('profileImage/6/thumbnail.jpg');
                    res.body.comments[4].name.should.equals('user Meier6');
                    res.body.comments[4].comment.should.equals('irgendwas5');
                    res.body.comments[4].created.should.equals(506);

                    res.body.comments[5].profileUrl.should.equals('profileImage/7/thumbnail.jpg');
                    res.body.comments[5].name.should.equals('user Meier7');
                    res.body.comments[5].comment.should.equals('irgendwas6');
                    res.body.comments[5].created.should.equals(505);
                });
            });
    });

    it('Getting all comments for a book recommendation - Return 200', function () {

        let commands = [];

        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '2'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '3'})")
            .create("(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '4'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '5'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '6'})")
            .create("(b)-[:IS_CONTACT {type: 'Freund'}]->(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());
        commands.push(db.cypher().match("(a:User {userId: '1'}), (b:User {userId: '7'})")
            .create("(a)-[:IS_CONTACT {type: 'Freund'}]->(b)")
            .end().getCommand());

        commands.push(db.cypher().create("(:Page {title: 'page1Title', label:'Book', language: 'de', description: 'page1', modified: 5072, pageId: '0'})").end().getCommand());

        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '1'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 511, comment: 'irgendwas', recommendationId: '0'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '2'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 510, comment: 'irgendwas', recommendationId: '1'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '3'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 509, comment: 'irgendwas2', recommendationId: '2'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '4'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 508, comment: 'irgendwas3', recommendationId: '3'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '5'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 507, comment: 'irgendwas4', recommendationId: '4'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '6'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 506, comment: 'irgendwas5', recommendationId: '5'})-[:RECOMMENDS]->(a)").end().getCommand());
        commands.push(db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '7'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 505, comment: 'irgendwas6', recommendationId: '6'})-[:RECOMMENDS]->(a)").end().getCommand());

        return db.cypher().match("(a:Page {pageId: '0'}), (b:User {userId: '8'})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation {created: 504, comment: 'irgendwas7', recommendationId: '7'})-[:RECOMMENDS]->(a)")
            .end().send(commands).then(function () {
                return requestHandler.login(users.validUser).then(function (agent) {
                    requestAgent = agent;
                    return requestHandler.getWithData('/api/page/comments', {
                        skip: '0',
                        maxItems: 10,
                        onlyContacts: false,
                        pageId: '0'
                    }, requestAgent);
                }).then(function (res) {
                    res.status.should.equal(200);

                    res.body.totalNumberOfComments.should.equals(7);
                    res.body.comments.length.should.equals(7);

                    res.body.comments[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
                    res.body.comments[0].name.should.equals('user Meier2');
                    res.body.comments[0].comment.should.equals('irgendwas');
                    res.body.comments[0].created.should.equals(510);

                    res.body.comments[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                    res.body.comments[1].name.should.equals('user Meier3');
                    res.body.comments[1].comment.should.equals('irgendwas2');
                    res.body.comments[1].created.should.equals(509);

                    res.body.comments[2].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                    res.body.comments[2].name.should.equals('user Meier4');
                    res.body.comments[2].comment.should.equals('irgendwas3');
                    res.body.comments[2].created.should.equals(508);

                    res.body.comments[3].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                    res.body.comments[3].name.should.equals('user Meier5');
                    res.body.comments[3].comment.should.equals('irgendwas4');
                    res.body.comments[3].created.should.equals(507);

                    res.body.comments[4].profileUrl.should.equals('profileImage/6/thumbnail.jpg');
                    res.body.comments[4].name.should.equals('user Meier6');
                    res.body.comments[4].comment.should.equals('irgendwas5');
                    res.body.comments[4].created.should.equals(506);

                    res.body.comments[5].profileUrl.should.equals('profileImage/7/thumbnail.jpg');
                    res.body.comments[5].name.should.equals('user Meier7');
                    res.body.comments[5].comment.should.equals('irgendwas6');
                    res.body.comments[5].created.should.equals(505);

                    res.body.comments[6].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
                    res.body.comments[6].name.should.equals('user Meier8');
                    res.body.comments[6].comment.should.equals('irgendwas7');
                    res.body.comments[6].created.should.equals(504);
                });
            });
    });
});
