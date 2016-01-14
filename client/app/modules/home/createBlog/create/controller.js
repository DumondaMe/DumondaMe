'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'userInfo', 'CreateBlogVisibility', '$mdDialog', 'FileReader', 'FileReaderUtil', 'CreateBlogCheck', 'UploadBlog',
            function ($scope, userInfo, CreateBlogVisibility, $mdDialog, FileReader, FileReaderUtil, CreateBlogCheck, UploadBlog) {
                var ctrl = this;
                ctrl.userInfo = userInfo.getUserInfo();
                ctrl.visibility = "Alle";
                ctrl.internalCommands = ctrl.commands || {};
                ctrl.blogUploadStarted = false;

                CreateBlogVisibility.reset();

                ctrl.cancel = function () {
                    FileReader.abort();
                    $mdDialog.cancel();
                };

                ctrl.openVisibility = function () {
                    if (!ctrl.blogUploadStarted) {
                        ctrl.onOpenVisibilityEvent();
                    }
                };

                ctrl.internalCommands.activateVisibility = function () {
                    if (CreateBlogVisibility.isPublic()) {
                        ctrl.visibility = "Alle";
                    } else {
                        ctrl.visibility = CreateBlogVisibility.getVisibilityDescription();
                    }
                };

                ctrl.uploadBlog = function () {
                    if (ctrl.sendBlogAllowed && !ctrl.blogUploadStarted) {
                        ctrl.blogUploadStarted = true;
                        UploadBlog.upload($scope.blogText, ctrl.imageForUploadPreviewData).then(function (resp) {
                            $mdDialog.hide(resp);
                        });
                    }
                };

                $scope.$watch('blogText', function (newBlogText) {
                    ctrl.sendBlogAllowed = CreateBlogCheck.isSendBlogAllowed(newBlogText, ctrl.imageForUploadPreviewStart);
                });

                $scope.$watch('imageForUpload', function (newImage) {
                    if (newImage) {
                        FileReader.onloadend = function () {
                            $scope.$apply(function () {
                                ctrl.imageForUploadPreviewStart = false;
                                ctrl.sendBlogAllowed = CreateBlogCheck.isSendBlogAllowed($scope.blogText, ctrl.imageForUploadPreviewStart);
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
    }
};

