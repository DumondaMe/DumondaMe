'use strict';

module.exports = ['$state', 'YoutubeThumbnail', function ($state, YoutubeThumbnail) {
    var ctrl = this;

    if (ctrl.recommendation.label === 'Youtube') {
        ctrl.recommendation.url = YoutubeThumbnail.getThumbnail(ctrl.recommendation.link)
    }

    ctrl.navToDetail = function () {
        if (ctrl.recommendation.label !== 'Blog') {
            $state.go('page.detail', {label: ctrl.recommendation.label, pageId: ctrl.recommendation.pageId});
        }
    }
}];
