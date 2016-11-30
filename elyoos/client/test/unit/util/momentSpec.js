'use strict';

var moment = require('../../../app/modules/util/moment.js');

describe('Tests of instantiating moment', function () {

    it('moment should exist', function () {
        expect(moment()).to.exist;
    });
});
