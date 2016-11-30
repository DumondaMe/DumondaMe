'use strict';

module.exports = ['$state', 'YoutubeThumbnail', function ($state, YoutubeThumbnail) {
    var ctrl = this;

    ctrl.getYoutubeImage = YoutubeThumbnail.getImage;

    ctrl.goToDetail = function () {
        $state.go('page.detail', {label: ctrl.page.label, pageId: ctrl.page.pageId});
    };
}];

