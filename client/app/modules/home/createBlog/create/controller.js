'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'userInfo', 'CreateBlogVisibility', '$mdDialog', 'FileReader', 'FileReaderUtil', 'CreateBlogCheck',
            function ($scope, userInfo, CreateBlogVisibility, $mdDialog, FileReader, FileReaderUtil, CreateBlogCheck) {
                var ctrl = this;
                ctrl.userInfo = userInfo.getUserInfo();
                ctrl.visibility = "Alle";
                ctrl.internalCommands = ctrl.commands || {};

                CreateBlogVisibility.reset();

                ctrl.cancel = function () {
                    FileReader.abort();
                    $mdDialog.cancel();
                };

                ctrl.openVisibility = function () {
                    ctrl.onOpenVisibilityEvent();
                };

                ctrl.internalCommands.activateVisibility = function () {
                    if (CreateBlogVisibility.isPublic()) {
                        ctrl.visibility = "Alle";
                    } else {
                        ctrl.visibility = CreateBlogVisibility.getVisibilityDescription();
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
                                ctrl.imageForUploadPreview = FileReader.result;
                                ctrl.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob(ctrl.imageForUploadPreview);
                            });
                        };
                        FileReader.onloadstart = function () {
                            $scope.$apply(function () {
                                ctrl.imageForUploadPreviewStart = true;
                            });
                        };
                        FileReader.readAsDataURL(newImage);
                    }
                });
            }];
    }
};

