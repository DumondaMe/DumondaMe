'use strict';

module.exports = ['PinwallBlogService', function (PinwallBlogService) {
    var ctrl = this;

    ctrl.blogRemoved = function (blogId) {
        PinwallBlogService.removeBlog(ctrl.pinwall, blogId);
    };
}];


