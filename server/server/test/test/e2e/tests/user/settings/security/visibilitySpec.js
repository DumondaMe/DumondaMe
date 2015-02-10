'use strict';

var libUser = require('../../../../../../../lib/user')();
var requestHandler = require('../../../util/request');
var users = require('../../../util/user');
var should = require('chai').should();
var db = require('../../../util/db');

describe('Integration Tests for the security visibility settings', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        return db.clearDatabase().then(function () {
            var commands = [];
            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '1234', name: 'user Meier', userId: '1'})").end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:IS_VISIBLE_STANDARD {type: 'Freund'}]->(:Visibility {profile: true, profileData: true, contacts: false, image: true})")
                .end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:IS_VISIBLE {type: 'Familie'}]->(:Visibility {profile: true, profileData: true, contacts: true, image: true})")
                .end().getCommand());
            commands.push(db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:IS_VISIBLE {type: 'Bekannter'}]->(:Visibility {profile: true, profileData: false, contacts: false, image: true})")
                .end().getCommand());
            return db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:IS_VISIBLE_NO_CONTACT]->(:Visibility {profile: false, profileData: false, contacts: false, image: false})")
                .end().send(commands);
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });

    it('Get the visibility security settings of the user- Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/user/settings/security/visibility', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.normal.length.should.equal(2);
            res.body.normal[0].type.should.equal('Familie');
            res.body.normal[0].profileVisible.should.be.true;
            res.body.normal[0].profileDataVisible.should.be.true;
            res.body.normal[0].imageVisible.should.be.true;
            res.body.normal[0].contactsVisible.should.be.true;
            res.body.normal[1].type.should.equal('Bekannter');
            res.body.normal[1].profileVisible.should.be.true;
            res.body.normal[1].profileDataVisible.should.be.false;
            res.body.normal[1].imageVisible.should.be.true;
            res.body.normal[1].contactsVisible.should.be.false;

            res.body.standard.type.should.equal('Freund');
            res.body.standard.profileVisible.should.be.true;
            res.body.standard.profileDataVisible.should.be.true;
            res.body.standard.imageVisible.should.be.true;
            res.body.standard.contactsVisible.should.be.false;

            res.body.noContact.profileVisible.should.be.false;
            res.body.noContact.profileDataVisible.should.be.false;
            res.body.noContact.imageVisible.should.be.false;
            res.body.noContact.contactsVisible.should.be.false;
        });
    });
});
