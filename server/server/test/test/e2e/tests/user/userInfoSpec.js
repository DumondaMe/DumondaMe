'use strict';

var app = require('../../../../../server');
var libUser = require('../../../../../lib/user')();
var users = require('../util/user');
var requestHandler = require('../util/request');
var should = require('chai').should();
var db = require('../util/db');

describe('Integration Tests User Name', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return db.clearDatabase().then(function () {

            return db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '1234', name: 'user Meier', userId:'1'})")
                .end().send();
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
            //cms/1/profile/profilePreview.jpg
            res.body.profileImage.should.contain('?path=55c1c4822e77717c3506f005e7ee1e95b24688fadaf7da&expires=');
        });
    });
});
