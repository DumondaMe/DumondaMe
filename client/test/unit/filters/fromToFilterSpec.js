'use strict';

var filter = require('../../../app/modules/filters/fromToFilter.js');


describe('Tests of filter fromTo', function () {
    var collectionToFilter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


    it('Filter from element 3 to 5', function () {
        var expectedElements = filter()(collectionToFilter, 2, 3);
        expect(expectedElements.length).to.equal(3);
        expect(expectedElements[0]).to.equal(3);
        expect(expectedElements[1]).to.equal(4);
        expect(expectedElements[2]).to.equal(5);
    });

});
