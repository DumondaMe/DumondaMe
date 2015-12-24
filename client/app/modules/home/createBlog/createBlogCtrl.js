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
        ctrl.mainView = true;
        ctrl.visibility = "Alle";
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.userInfo = userInfo.getUserInfo();
        ctrl.privacyTypesSelected = [];
        ctrl.sendBlogAllowed = false;

        angular.forEach(ctrl.userInfo.privacyTypes, function (privacyType) {
            ctrl.privacyTypesSelected.push({type: privacyType, selected: false});
        });

        ctrl.cancel = function () {
            FileReader.abort();
            $mdDialog.cancel();
        };

        ctrl.openVisibility = function () {
            ctrl.mainView = false;
        };

        ctrl.closeVisibility = function () {
            ctrl.mainView = true;
            if (ctrl.isPublic) {
                ctrl.visibility = "Alle";
            } else {
                ctrl.visibility = "";
                angular.forEach(ctrl.privacyTypesSelected, function (privacyType) {
                    if (privacyType.selected) {
                        ctrl.visibility = ctrl.visibility.concat(privacyType.type + ", ");
                    }
                });
                ctrl.visibility = ctrl.visibility.substring(0, ctrl.visibility.length - 2);
            }
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

