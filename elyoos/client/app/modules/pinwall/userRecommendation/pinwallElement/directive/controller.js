'use strict';

module.exports = ['$state', 'dateFormatter', 'YoutubeThumbnail',
    function ($state, dateFormatter, YoutubeThumbnail) {
        var ctrl = this;

        ctrl.getYoutubeImage = YoutubeThumbnail.getImage;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
    }];

