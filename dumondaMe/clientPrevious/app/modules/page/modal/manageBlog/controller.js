'use strict';

module.exports = ['ElyModal', 'Topics', 'Languages', 'UploadBlogEdit', 'errorToast',
    function (ElyModal, Topics, Languages, UploadBlogEdit, errorToast) {
        var ctrl = this;
        ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
        ctrl.data.selectedLanguage = Languages.getLanguages(ctrl.data.selectedLanguage)[0];

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.showPrivacyEvent = function () {
            ctrl.showPrivacy = true;
        };

        ctrl.closeVisibility = function () {
            ctrl.showPrivacy = false;
            ctrl.setVisibility();
        };

        ctrl.dataChanged = function (hasChanged, isValid) {
            ctrl.isValidToChange = hasChanged && isValid;
        };

        ctrl.imageLoad = function (running) {
            ctrl.uploadStarted = running;
        };

        ctrl.editBlog = function () {
            if (!ctrl.uploadStarted) {
                ctrl.uploadStarted = true;
                UploadBlogEdit.upload(ctrl.data.pageId, ctrl.data.blogText, Topics.getCodes(ctrl.data.selectedTopics),
                    ctrl.data.selectedLanguage, ctrl.data.imageForUploadPreviewData)
                    .then(function (resp) {
                        resp.url = ctrl.data.imageForUploadPreview;
                        ElyModal.hide(resp);
                    }).catch(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Blog konnte nicht hochgeladen werden');
                });
            }
        };
    }];
