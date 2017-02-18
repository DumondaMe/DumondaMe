'use strict';

let testee = require('../../../../../../../models/import/gmail/parser');
let testXML = require('./xmlData');
let expect = require('chai').expect;

describe('Unit Test import/gmail/parser', function () {

    it('Parse emails and contact', function () {

        let result = testee.parseXML(testXML.getTestXML());
        expect(result.length).to.be.equal(3);
        expect(result).to.containSubset([{email: 'test.elyoos1@elyoos.org'}]);
        expect(result).to.containSubset([{email: 'test.elyoos2@elyoos.org', name: 'Hans Muster3'}]);
        expect(result).to.containSubset([{email: 'test.elyoos3@elyoos.org', name: 'Hans Muster4'}]);
    });
});
