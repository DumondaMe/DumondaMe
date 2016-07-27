'use strict';

module.exports = ['$state', function ($state) {
    var ctrl = this;

    ctrl.navToDetail = function () {
        if (ctrl.recommendation.label !== 'Blog') {
            $state.go('page.detail', {label: ctrl.recommendation.label, pageId: ctrl.recommendation.pageId});
        } else {
            $state.go('blog.detail', {blogId: ctrl.recommendation.blogId});
        }
    };
}];
