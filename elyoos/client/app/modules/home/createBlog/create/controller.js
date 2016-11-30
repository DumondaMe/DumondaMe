'use strict';

module.exports = ['$scope', 'userInfo', 'CreateBlogVisibility', 'ElyModal', 'FileReader', 'FileReaderUtil', 'CreateBlogCheck', 'UploadBlog',
    'Topics', 'errorToast', 'Languages',
    function ($scope, userInfo, CreateBlogVisibility, ElyModal, FileReader, FileReaderUtil, CreateBlogCheck, UploadBlog, Topics,
              errorToast, Languages) {
        var ctrl = this;
        ctrl.userInfo = userInfo.getUserInfo();
        ctrl.visibility = ["Öffentlich"];
        ctrl.internalCommands = ctrl.commands || {};
        ctrl.blogUploadStarted = false;
        ctrl.topics = Topics.topics;
        ctrl.languages = Languages.languages;

        CreateBlogVisibility.reset();

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.openVisibility = function () {
            if (!ctrl.blogUploadStarted) {
                ctrl.onOpenVisibilityEvent();
            }
        };

        ctrl.internalCommands.activateVisibility = function () {
            if (CreateBlogVisibility.isPublic()) {
                ctrl.visibility = ["Öffentlich"];
            } else {
                ctrl.visibility = CreateBlogVisibility.getVisibilityDescription();
            }
        };

        ctrl.uploadBlog = function () {
            if (ctrl.sendBlogAllowed && !ctrl.blogUploadStarted) {
                ctrl.blogUploadStarted = true;
                UploadBlog.upload(ctrl.blogText, ctrl.blogTitle, Topics.getCodes(ctrl.selectedTopics), ctrl.selectedLanguage, ctrl.imageForUploadPreviewData)
                    .then(function (resp) {
                        ElyModal.hide(resp);
                    }).catch(function () {
                    ctrl.blogUploadStarted = false;
                    errorToast.showError('Blog konnte nicht hochgeladen werden');
                });
            }
        };

        ctrl.dataChanged = function () {
            ctrl.sendBlogAllowed = CreateBlogCheck.isSendBlogAllowed(ctrl.blogText, ctrl.blogTitle, ctrl.selectedTopics, ctrl.selectedLanguage,
                ctrl.imageForUploadPreviewStart);
        };

        $scope.$watch('imageForUpload', function (newImage) {
            if (newImage) {
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.imageForUploadPreviewStart = false;
                        ctrl.sendBlogAllowed = CreateBlogCheck.isSendBlogAllowed(ctrl.blogText, ctrl.blogTitle, ctrl.selectedTopics, 
                            ctrl.selectedLanguage, ctrl.imageForUploadPreviewStart);
                        ctrl.imageForUploadPreview = FileReader.result;
                        ctrl.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob(ctrl.imageForUploadPreview);
                    });
                };
                FileReader.onloadstart = function () {
                    $scope.$apply(function () {
                        ctrl.sendBlogAllowed = false;
                        ctrl.imageForUploadPreviewStart = true;
                    });
                };
                FileReader.readAsDataURL(newImage);
            }
        });
    }];

