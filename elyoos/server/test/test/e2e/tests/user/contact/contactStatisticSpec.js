'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting the contact statistics', function () {

    let requestAgent;

    beforeEach(function () {

        let commands = [];
        return db.clearDatabase().then(function () {
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', forename: 'user', surname: 'Meier', userId: '1'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Familie'}]->(:Privacy {profile: true, image: true}), " +
                    "(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true}), " +
                    "(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo2.ch', name: 'user2 Meier2', forename: 'user2', surname: 'Meier2', userId: '2'})").end().getCommand());

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo3.ch', name: 'user3 Meier3', forename: 'user3', surname: 'Meier3', userId: '3'})").end().getCommand());

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo4.ch', name: 'user4 Meier4', forename: 'user4', surname: 'Meier4', userId: '4'})").end().getCommand());

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo5.ch', name: 'user5 Meier5', forename: 'user5', surname: 'Meier5', userId: '5'})").end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '2'})")
                .create("(u)-[:IS_CONTACT {type: 'Familie', contactAdded: 500}]->(u2)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '3'})")
                .create("(u)-[:IS_CONTACT {type: 'Familie', contactAdded: 501}]->(u2)").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '4'})")
                .create("(u)-[:IS_CONTACT {type: 'Familie', contactAdded: 502}]->(u2)").end().getCommand());
            return db.cypher().match("(u:User {userId: '1'}), (u2:User {userId: '5'})")
                .create("(u)-[:IS_CONTACT {type: 'Bekannter', contactAdded: 500}]->(u2)").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting the contact statistics - Return 200', function () {

        return requestHandler.login(users.validUser).then(function (agent) {
            requestAgent = agent;
            return requestHandler.get('/api/user/contact/statistic', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.statistic.length.should.equals(3);
            res.body.statistic[0].type.should.equals('Familie');
            res.body.statistic[0].count.should.equals(3);
            res.body.statistic[1].type.should.equals('Bekannter');
            res.body.statistic[1].count.should.equals(1);
            res.body.statistic[2].type.should.equals('Freund');
            res.body.statistic[2].count.should.equals(0);
            res.body.numberOfContacts.should.equals(4);
        });
    });
});
