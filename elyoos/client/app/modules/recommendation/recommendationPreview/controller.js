'use strict';

module.exports = ['YoutubeThumbnail', function (YoutubeThumbnail) {
    var ctrl = this;

    if (ctrl.recommendation.label === 'Youtube') {
        ctrl.recommendation.url = YoutubeThumbnail.getThumbnail(ctrl.recommendation.linkEmbed);
    }
}];
