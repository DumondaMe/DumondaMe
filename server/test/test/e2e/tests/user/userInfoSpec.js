'use strict';

var libUser = require('../../../../../lib/user')();
var users = require('../util/user');
var requestHandler = require('../util/request');
var db = require('../util/db');

describe('Integration Tests User Name', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return db.clearDatabase().then(function () {

            var commands = [];

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId:'1'})").end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Freund'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());

            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY {type: 'Bekannter'}]->(:Privacy {profile: true, image: true})")
                .end().getCommand());

            return db.cypher().create("(:User)")
                .end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get User Name when logged in - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/user/userInfo', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.name.should.equal('user Meier');
            res.body.profileImage.should.equal('profileImage/1/thumbnail.jpg');
            res.body.profileImagePreview.should.equal('profileImage/1/profilePreview.jpg');
            res.body.email.should.equal('user@irgendwo.ch');
            res.body.privacyTypes.length.should.equal(2);
            res.body.privacyTypes[0].should.equal('Bekannter');
            res.body.privacyTypes[1].should.equal('Freund');
        });
    });
});
