'use strict';

module.exports = ['$scope', 'ElyModal', 'FileReaderUtil', 'FileReader', 'Topics', 'Languages', 'UploadBlog', 'UploadBlogEdit', 'errorToast',
    'CreateBlogVisibility',
    function ($scope, ElyModal, FileReaderUtil, FileReader, Topics, Languages, UploadBlog, UploadBlogEdit, errorToast, CreateBlogVisibility) {
        var ctrl = this;

        ctrl.visibility = ["Öffentlich"];
        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;

        CreateBlogVisibility.reset();

        if (ctrl.isEditMode) {
            ctrl.data.selectedTopics = Topics.getTopics(ctrl.data.selectedTopics);
            ctrl.data.selectedLanguage = Languages.getLanguages(ctrl.data.selectedLanguage)[0];
            ctrl.dataOnServer = angular.copy(ctrl.data);
        } else {
            ctrl.data = {};
        }

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.closeVisibility = function () {
            ctrl.showPrivacy = false;
            if (CreateBlogVisibility.isPublic()) {
                ctrl.visibility = ["Öffentlich"];
            } else {
                ctrl.visibility = CreateBlogVisibility.getVisibilityDescription();
            }
        };

        ctrl.dataChanged = function () {
            ctrl.dataHasChanged = !angular.equals(ctrl.dataOnServer, ctrl.data);
        };

        ctrl.createBlog = function () {
            if (!ctrl.uploadStarted) {
                ctrl.uploadStarted = true;
                UploadBlog.upload(ctrl.data.blogText, ctrl.data.blogTitle, Topics.getCodes(ctrl.data.selectedTopics), ctrl.data.selectedLanguage,
                    ctrl.data.imageForUploadPreviewData)
                    .then(function (resp) {
                        ElyModal.hide(resp);
                    }).catch(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Blog konnte nicht hochgeladen werden');
                });
            }
        };

        ctrl.editBlog = function () {
            if (!ctrl.uploadStarted) {
                ctrl.uploadStarted = true;
                UploadBlogEdit.upload(ctrl.data.pageId, ctrl.data.blogText, Topics.getCodes(ctrl.data.selectedTopics), ctrl.data.selectedLanguage,
                    ctrl.data.imageForUploadPreviewData)
                    .then(function (resp) {
                        resp.url = ctrl.data.imageForUploadPreview;
                        ElyModal.hide(resp);
                    }).catch(function () {
                    ctrl.uploadStarted = false;
                    errorToast.showError('Blog konnte nicht hochgeladen werden');
                });
            }
        };

        $scope.$watch('imageForUpload', function (newImage) {
            if (newImage) {
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.data.imageForUploadPreview = FileReader.result;
                        ctrl.data.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob(ctrl.data.imageForUploadPreview);
                        ctrl.dataHasChanged = true;
                    });
                };
                FileReader.readAsDataURL(newImage);
            }
        });
    }];
