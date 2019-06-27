'use strict';

var getYoutubeId = function (embeddedImage) {
    var youtubeId = embeddedImage.replace('https://www.youtube.com/embed/', ''), listYoutubeId;
    listYoutubeId = youtubeId.split('?');
    return listYoutubeId[0];
};

module.exports = [function () {

    this.getImage = function (embeddedImage) {
        var youtubeId = getYoutubeId(embeddedImage);
        return 'https://img.youtube.com/vi/' + youtubeId + '/0.jpg';
    };

    this.getThumbnail = function (embeddedImage) {
        var youtubeId = getYoutubeId(embeddedImage);
        return 'https://img.youtube.com/vi/' + youtubeId + '/1.jpg';
    };
}];
