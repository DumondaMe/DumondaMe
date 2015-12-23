'use strict';

var isSendBlogAllowed = function (blogText, imageLoading) {
    if (!imageLoading && blogText) {
        return blogText.trim() !== '';
    }
    return false;
};

module.exports = ['$scope', 'dateFormatter', '$mdDialog', 'userInfo', 'FileReader', 'FileReaderUtil',
    function ($scope, dateFormatter, $mdDialog, userInfo, FileReader, FileReaderUtil) {
        var ctrl = this;
        ctrl.isPublic = true;
        ctrl.visibility = "Alle";
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.userInfo = userInfo.getUserInfo();
        ctrl.sendBlogAllowed = false;

        ctrl.cancel = function () {
            FileReader.abort();
            $mdDialog.cancel();
        };

        $scope.$watch('blogText', function (newBlogText) {
            ctrl.sendBlogAllowed = isSendBlogAllowed(newBlogText, $scope.imageForUploadPreviewStart);
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

