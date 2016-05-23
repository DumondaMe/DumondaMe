'use strict';

module.exports = ['Categories', 'YoutubeThumbnail', 'YoutubeAutoplay',
    function (Categories, YoutubeThumbnail, YoutubeAutoplay) {
        var ctrl = this;
        
        ctrl.getYoutubeImage = YoutubeThumbnail.getImage;
        ctrl.getYoutubeAutoplayLink = YoutubeAutoplay.getAutoplayLink;
        ctrl.showImagePreview = true;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;
        
    }];

