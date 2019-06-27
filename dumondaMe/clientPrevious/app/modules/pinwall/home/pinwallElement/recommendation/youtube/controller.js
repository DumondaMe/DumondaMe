'use strict';

module.exports = ['YoutubeThumbnail', 'YoutubeAutoplay',
    function (YoutubeThumbnail, YoutubeAutoplay) {
        var ctrl = this;
        
        ctrl.getYoutubeImage = YoutubeThumbnail.getImage;
        ctrl.getYoutubeAutoplayLink = YoutubeAutoplay.getAutoplayLink;
        ctrl.showImagePreview = true;
    }];

