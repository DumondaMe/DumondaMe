'use strict';

let testee = require('../../../../../../models/util/youtube');
let expect = require('chai').expect;

describe('Unit Test util/youtube', function () {

    it('Get valid embedded link for youtube link', function () {
        var result = testee.getEmbedUrl('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        expect(result).to.equal('https://www.youtube.com/embed/Lhku7ZBWEK8');
    });

    it('Get valid embedded link for youtube list link (list first)', function () {
        var result = testee.getEmbedUrl('https://www.youtube.com/watch?list=PL8027E1CE6CF2BA5F&v=Vhl6oskxrs0');
        expect(result).to.equal('https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F');
    });

    it('Get valid embedded link for youtube list link (list second)', function () {
        var result = testee.getEmbedUrl('https://www.youtube.com/watch?v=Vhl6oskxrs0&list=PL8027E1CE6CF2BA5F&index=1');
        expect(result).to.equal('https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F');
    });

    it('Get valid embedded link for mobile youtube link', function () {
        var result = testee.getEmbedUrl('https://m.youtube.com/watch?v=Lhku7ZBWEK8');
        expect(result).to.equal('https://www.youtube.com/embed/Lhku7ZBWEK8');
    });

    it('Get valid embedded link for mobile youtube list link (list first)', function () {
        var result = testee.getEmbedUrl('https://m.youtube.com/watch?list=PL8027E1CE6CF2BA5F&v=Vhl6oskxrs0');
        expect(result).to.equal('https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F');
    });

    it('Get valid embedded link for mobile youtube list link (list second)', function () {
        var result = testee.getEmbedUrl('https://m.youtube.com/watch?v=Vhl6oskxrs0&list=PL8027E1CE6CF2BA5F&index=1');
        expect(result).to.equal('https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F');
    });

    it('Get valid embedded link for mobile youtube with feature', function () {
        var result = testee.getEmbedUrl('https://m.youtube.com/watch?v=a9XwwSDsCr0&feature=youtu.be&app=desktop');
        expect(result).to.equal('https://www.youtube.com/embed/a9XwwSDsCr0');
    });

    it('Get null link for invalid youtube link', function () {
        var result = testee.getEmbedUrl('https://www.youtube.com/embed/Lhku7ZBWEK8');
        expect(result).to.equal(null);
    });
});
