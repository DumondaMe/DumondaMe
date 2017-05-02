'use strict';

module.exports = ['CreateBlogVisibility', function (CreateBlogVisibility) {
    var ctrl = this;
    ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
    ctrl.isPublic = CreateBlogVisibility.isPublic();
    ctrl.privacyTypes = CreateBlogVisibility.getPrivacyTypes();

    ctrl.isPublicChanged = function () {
        CreateBlogVisibility.setIsPublic(ctrl.isPublic);
        ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
        ctrl.changeVisibilityEvent();
    };

    ctrl.privacyTypesSelectedChanged = function (type) {
        ctrl.isPublic = false;
        CreateBlogVisibility.setIsPublic(false);
        CreateBlogVisibility.setPrivacyTypesSelected(type);
        ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
        ctrl.changeVisibilityEvent();
    };

    ctrl.changeVisibilityEvent = function () {
        if (angular.isFunction(ctrl.onChangeVisibilityEvent)) {
            ctrl.onChangeVisibilityEvent(ctrl.validVisibility);
        }
    };

    ctrl.closeVisibility = function () {
        ctrl.onCloseVisibilityEvent();
    };
}];

