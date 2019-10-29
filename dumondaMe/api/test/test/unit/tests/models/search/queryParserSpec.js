'use strict';

let testee = require('../../../../../../models/search/queryParser');
let expect = require('chai').expect;

describe('Testing the query parser', function () {

    it('One word with more then 3 letters', function () {
        var result = testee.wordsQuery('Test', 'User.name:');
        expect(result).to.equal(' (User.name:Test* OR User.name:Test~0.4)');
    });

    it('One word with 3 letters', function () {
        var result = testee.wordsQuery('Tes', 'User.name:');
        expect(result).to.equal(' (User.name:Tes* OR User.name:Tes~0.5)');
    });

    it('One word less then 3 letters', function () {
        var result = testee.wordsQuery('Te', 'User.name:');
        expect(result).to.equal(' User.name:Te*');
    });

    it('Two words', function () {
        var result = testee.wordsQuery('Test Universum', 'User.name:');
        expect(result).to.equal(' User.name:Test~0.4 AND (User.name:Universum* OR User.name:Universum~0.4)');
    });

    it('Proximity matching disabled when only one word', function () {
        var result = testee.proximityMatchingQuery('Test', 'User.name:');
        expect(result).to.equal('');
    });

    it('Proximity matching enabled when two words', function () {
        var result = testee.proximityMatchingQuery('Test Irgenwas', 'User.name:(');
        expect(result).to.equal('User.name:("Test Irgenwas"~20)^20');
    });
});
