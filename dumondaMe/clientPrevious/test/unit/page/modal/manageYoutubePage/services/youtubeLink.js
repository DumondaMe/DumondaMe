'use strict';

var YoutubeLink = require('../../../../../../app/modules/page/modal/manageYoutubePage/services/youtubeLink')[0];

describe('Test of PageYoutubeLink Service', function () {

    var testee;

    beforeEach(function (done) {
        testee = new YoutubeLink();
        done();
    });

    it('Check valid youtube link', function () {
        var result = testee.isValidYoutubeLink('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        expect(result).to.equal(true);
    });

    it('Check valid mobile youtube link', function () {
        var result = testee.isValidYoutubeLink('https://m.youtube.com/watch?v=Lhku7ZBWEK8');
        expect(result).to.equal(true);
    });

    it('Not accepting embedded youtube links', function () {
        var result = testee.isValidYoutubeLink('https://www.youtube.com/embed/Lhku7ZBWEK8');
        expect(result).to.equal(false);
    });

    it('Not accepting objects as link', function () {
        var result = testee.isValidYoutubeLink({});
        expect(result).to.equal(false);
    });

    it('Get valid embedded link for youtube link', function () {
        var result = testee.getYoutubeLink('https://www.youtube.com/watch?v=Lhku7ZBWEK8');
        expect(result).to.equal('https://www.youtube.com/embed/Lhku7ZBWEK8');
    });

    it('Get valid embedded link for youtube list link (list first)', function () {
        var result = testee.getYoutubeLink('https://www.youtube.com/watch?list=PL8027E1CE6CF2BA5F&v=Vhl6oskxrs0');
        expect(result).to.equal('https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F');
    });

    it('Get valid embedded link for youtube list link (list second)', function () {
        var result = testee.getYoutubeLink('https://www.youtube.com/watch?v=Vhl6oskxrs0&list=PL8027E1CE6CF2BA5F&index=1');
        expect(result).to.equal('https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F');
    });

    it('Get valid embedded link for mobile youtube link', function () {
        var result = testee.getYoutubeLink('https://m.youtube.com/watch?v=Lhku7ZBWEK8');
        expect(result).to.equal('https://www.youtube.com/embed/Lhku7ZBWEK8');
    });

    it('Get valid embedded link for mobile youtube list link (list first)', function () {
        var result = testee.getYoutubeLink('https://m.youtube.com/watch?list=PL8027E1CE6CF2BA5F&v=Vhl6oskxrs0');
        expect(result).to.equal('https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F');
    });

    it('Get valid embedded link for mobile youtube list link (list second)', function () {
        var result = testee.getYoutubeLink('https://m.youtube.com/watch?v=Vhl6oskxrs0&list=PL8027E1CE6CF2BA5F&index=1');
        expect(result).to.equal('https://www.youtube.com/embed/Vhl6oskxrs0?list=PL8027E1CE6CF2BA5F');
    });

    it('Get null link for invalid youtube link', function () {
        var result = testee.getYoutubeLink('https://www.youtube.com/embed/Lhku7ZBWEK8');
        expect(result).to.equal(null);
    });

    //https://m.youtube.com/watch?v=a9XwwSDsCr0&feature=youtu.be&app=desktop
    //https://m.youtube.com/watch?v=a9XwwSDsCr0&feature=youtu.be
});
