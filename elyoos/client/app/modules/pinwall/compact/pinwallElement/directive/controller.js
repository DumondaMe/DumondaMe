'use strict';

module.exports = ['$mdMedia', 'dateFormatter', 'YoutubeThumbnail',
    function ($mdMedia, dateFormatter, YoutubeThumbnail) {
        var ctrl = this;

        ctrl.$mdMedia = $mdMedia;
        ctrl.getYoutubeImage = YoutubeThumbnail.getImage;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
    }];

