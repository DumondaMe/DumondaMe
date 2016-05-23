'use strict';

module.exports = [function () {

    this.getImage = function (embeddedImage) {
        var youtubeId = embeddedImage.replace('https://www.youtube.com/embed/', '');
        return 'https://img.youtube.com/vi/' + youtubeId + '/0.jpg';
    };
}];
