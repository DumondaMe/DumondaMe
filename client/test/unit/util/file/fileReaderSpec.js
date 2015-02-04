'use strict';

var fileReader = require('../../../../app/modules/util/file/fileReader.js');

describe('Tests of instantiating FileReader', function () {

    it('FileReader should exist', function () {
        expect(fileReader()).to.exist;
    });
});
