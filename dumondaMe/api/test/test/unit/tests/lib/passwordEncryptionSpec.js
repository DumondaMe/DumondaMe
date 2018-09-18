'use strict';

let testee = require('elyoos-server-lib').passwordEncryption;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Unit Test lib/passwordEncryption', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Generate a password hash', function () {

        return testee.generatePasswordHash('1').then(function (hash) {
            expect(hash.length).to.equal(60);
        });
    });

    it('Compare Password with Hash', function () {

        return testee.comparePassword('1', '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm').then(function (result) {
            expect(result).to.be.true;
        });
    });

    it('Compare Password with Hash fails', function () {

        return testee.comparePassword('2', '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm').then(function (result) {
            expect(result).to.be.false;
        });
    });

    it('Generate a password hash and compare', function () {

        return testee.generatePasswordHash('1').then(function (hash) {
            return testee.comparePassword('1', hash);
        }).then(function (isSamePassword) {
            expect(isSamePassword).to.be.true;
        });
    });

});
