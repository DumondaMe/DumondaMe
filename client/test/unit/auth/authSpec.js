'use strict';

var Auth = require('../../../app/modules/auth/auth')[3];

describe('Test of Auth Services', function () {
    var httpBackend, http, cookies, q, testee;

    function MockUser(email) {
        this.email = email;
    }

    beforeEach(function (done) {
        angular.mock.module('ngCookies');

        inject(function ($httpBackend, $cookies, $q, $http) {
            httpBackend = $httpBackend;
            cookies = $cookies;
            cookies.putObject('user', {username: 'irgendwas'});
            q = $q;
            http = $http;
            httpBackend.when('GET', 'api/user/profile').
                respond($q.when({userName: 'Steelman'}));

            testee = new Auth(http, cookies, q);
            done();
        });
    });

    it('Authorize returns always true when public', function () {
        var result = testee.authorize(true);
        expect(result).to.be.true;
    });

    it('Authorize returns true when a user is defined in cookieStore', function () {
        var result = testee.authorize(false);
        expect(result).to.be.true;
    });

    it('Authorize returns false when no user is defined in cookieStore', function () {
        cookies.put('user', {username: undefined});
        var result = testee.authorize(false);
        expect(result).to.be.true;
    });

    it('Successful login', function () {

        var user = new MockUser('irgenwas@irgendwo.ch'), resultSuccess, resultError;
        httpBackend.when('POST', '/api/login').respond(user);

        testee.login(user).then(function (success) {
            resultSuccess = success;
        }, function (error) {
            resultError = error;
        });
        httpBackend.flush();

        expect(resultSuccess.email).to.equal(user.email);
        expect(resultError).to.be.undefined;
    });

    it('Failed login', function () {

        var user = new MockUser('irgenwas@irgendwo.ch'), resultSuccess, resultError;
        httpBackend.when('POST', '/api/login').respond(500, 'Ein Fehler');

        testee.login(user).then(function (success) {
            resultSuccess = success;
        }, function (error) {
            resultError = error;
        });
        httpBackend.flush();

        expect(resultSuccess).to.be.undefined;
        expect(resultError).to.equal('Ein Fehler');
    });

    it('Successful logout', function () {
        httpBackend.when('POST', '/api/logout').respond(200);
        var resultSuccess, resultError;

        testee.logout().then(function () {
            resultSuccess = true;
        }, function (error) {
            resultError = error;
        });
        httpBackend.flush();

        expect(resultSuccess).to.be.true;
        expect(resultError).to.be.undefined;
    });

    it('Failed logout', function () {
        httpBackend.when('POST', '/api/logout').respond(500, 'Ein Fehler');
        var resultSuccess, resultError;

        testee.logout().then(function () {
            resultSuccess = true;
        }, function (error) {
            resultError = error;
        });
        httpBackend.flush();

        expect(resultSuccess).to.be.undefined;
        expect(resultError).to.equal('Ein Fehler');
    });
});
