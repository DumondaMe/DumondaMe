'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['CreateBlogVisibility', function (CreateBlogVisibility) {
            var ctrl = this;
            ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
            ctrl.isPublic = CreateBlogVisibility.isPublic();
            ctrl.privacyTypesSelected = CreateBlogVisibility.getPrivacyTypesSelected();

            ctrl.isPublicChanged = function () {
                CreateBlogVisibility.setIsPublic(ctrl.isPublic);
                ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
            };

            ctrl.privacyTypesSelectedChanged = function (type) {
                CreateBlogVisibility.setPrivacyTypesSelected(type);
                ctrl.validVisibility = CreateBlogVisibility.isValidVisibility();
            };

            ctrl.closeVisibility = function () {
                ctrl.onCloseVisibilityEvent();
            };
        }];
    }
};

