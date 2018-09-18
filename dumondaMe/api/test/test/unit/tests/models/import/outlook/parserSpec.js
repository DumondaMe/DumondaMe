'use strict';

let testee = require('../../../../../../../models/import/outlook/parser');
let testXML = require('./jsonData');
let expect = require('chai').expect;

describe('Unit Test import/outlook/parser', function () {

    it('Parse emails and contact', function () {

        let result = testee.parse(testXML.getTestData());
        expect(result.length).to.be.equal(3);
        expect(result).to.containSubset([{email: 'hans.muster3@dumonda.me'}]);
        expect(result).to.containSubset([{email: 'hans.muster2@dumonda.me', name: 'Hans Muster2'}]);
        expect(result).to.containSubset([{email: 'hans.muster@dumonda.me', name: 'Hans Muster'}]);
    });
});
