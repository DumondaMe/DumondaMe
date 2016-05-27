'use strict';

module.exports = ['$state', 'Categories', 'YoutubeThumbnail', function ($state, Categories, YoutubeThumbnail) {
    var ctrl = this;

    ctrl.getCategory = Categories.getCategory;
    ctrl.getCategoryClass = Categories.getCategoryClass;

    ctrl.getYoutubeImage = YoutubeThumbnail.getImage;

    ctrl.goToDetail = function () {
        $state.go('page.detail', {label: ctrl.page.label, pageId: ctrl.page.pageId});
    };
}];

