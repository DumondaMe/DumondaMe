'use strict';

var app = require('../../../../../../../server');
var libUser = require('../../../../../../../lib/user')();
var users = require('../../../util/user');
var requestHandler = require('../../../util/request');
var should = require('chai').should();
var db = require('../../../util/db');

describe('Integration Tests for getting the security visibility settings', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return db.clearDatabase().then(function () {

            return db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '1234', userId: '0'})-[:IS_VISIBLE_NO_CONTACT]->" +
            "(:Visibility {profile: false, contacts: false, image: false, profileData: false})")
                .end().send()
                .then(function () {
                    return db.cypher().match("(u:User {userId: '0'})")
                        .create("(u)-[:IS_VISIBLE {type: 'Familie'}]->(:Visibility {profile: true, contacts: true, image: true, profileData: true})")
                        .end().send();
                })
                .then(function () {
                    return db.cypher().match("(u:User {userId: '0'})")
                        .create("(u)-[:IS_VISIBLE {type: 'Freund'}]->(:Visibility {profile: true, contacts: true, image: true, profileData: false})")
                        .end().send();
                });
        });
    });

    afterEach(function (done) {
        requestHandler.logout(done);
    });

    it('Get the visibility security settings of the user- Return a 200', function () {
        /*return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.get('/api/user/settings/security/visibility', agent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.length.should.equal(3);
            res.body[0].type.should.be.false;
            res.body[0].profile.should.be.false;
            res.body[0].contact.should.be.false;
            res.body[0].image.should.be.false;
            res.body[0].profileData.should.be.false;
         });*/
    });
});
