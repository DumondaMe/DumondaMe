'use strict';

let testee = require('../../../../../../../models/import/carddav/parser');
let testXML = require('./xmlData');
let expect = require('chai').expect;

describe('Unit Test import/carddav/parser', function () {

    it('Parse emails and contact', function () {

        let result = testee.parse(testXML.getTestXML());
        expect(result.length).to.be.equal(2);
        expect(result).to.containSubset([{email: 'test@elyoos.org', name: 'Hans Muster'}]);
        expect(result).to.containSubset([{email: 'test2@elyoos.org', name: 'Hans Muster2'}]);
    });
});
