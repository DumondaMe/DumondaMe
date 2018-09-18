'use strict';

let testee = require('../../../../../../../models/import/yahoo/parser');
let testXML = require('./jsonData');
let expect = require('chai').expect;

describe('Unit Test import/yahoo/parser', function () {

    it('Parse emails and contact', function () {

        let result = testee.parse(testXML.getTestData());
        expect(result.length).to.be.equal(2);
        expect(result).to.containSubset([{email: 'test2@elyoos.org'}]);
        expect(result).to.containSubset([{email: 'test@elyoos.org', name: 'Hans Muster'}]);
    });
});
