'use strict';

module.exports = ['YoutubeThumbnail',
    function (YoutubeThumbnail) {
        var ctrl = this;
        ctrl.getThumbnail = YoutubeThumbnail.getThumbnail;
    }];
