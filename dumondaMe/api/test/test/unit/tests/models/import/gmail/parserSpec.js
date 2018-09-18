'use strict';

let testee = require('../../../../../../../models/import/gmail/parser');
let testXML = require('./xmlData');
let expect = require('chai').expect;

describe('Unit Test import/gmail/parser', function () {

    it('Parse emails and contact', function () {

        let result = testee.parseXML(testXML.getTestXML());
        expect(result.length).to.be.equal(3);
        expect(result).to.containSubset([{email: 'test.dumondaMe1@dumonda.me'}]);
        expect(result).to.containSubset([{email: 'test.dumondaMe2@dumonda.me', name: 'Hans Muster3'}]);
        expect(result).to.containSubset([{email: 'test.dumondaMe3@dumonda.me', name: 'Hans Muster4'}]);
    });
});
