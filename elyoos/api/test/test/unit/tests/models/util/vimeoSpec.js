'use strict';

let testee = require('../../../../../../models/util/vimeo');
let expect = require('chai').expect;

describe('Unit Test util/vimeo', function () {

    it('Get valid embedded link for vimeo link', function () {
        var result = testee.getEmbedUrl('https://vimeo.com/channels/staffpicks/251713531');
        expect(result).to.equal('https://player.vimeo.com/video/251713531');
    });
});
