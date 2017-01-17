'use strict';

module.exports = ['$scope', 'ElyModal', 'FileReaderUtil', 'FileReader', 'Topics', 'Languages', 'UploadBlog', 'errorToast',
    'CreateBlogVisibility',
    function ($scope, ElyModal, FileReaderUtil, FileReader, Topics, Languages, UploadBlog, errorToast, CreateBlogVisibility) {
        var ctrl = this;

        ctrl.visibility = ["Öffentlich"];
        ctrl.data = {};
        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;

        CreateBlogVisibility.reset();

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

        $scope.$watch('imageForUpload', function (newImage) {
            if (newImage) {
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.data.imageForUploadPreview = FileReader.result;
                        ctrl.data.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob(ctrl.data.imageForUploadPreview);
                    });
                };
                FileReader.readAsDataURL(newImage);
            }
        });
    }];
