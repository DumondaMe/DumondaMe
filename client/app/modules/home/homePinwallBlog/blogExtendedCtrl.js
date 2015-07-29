'use strict';

var isSendBlogAllowed = function (selectedPrivacyType, blogText, selectPublic, imageLoading) {
    if (!imageLoading) {
        if ((blogText && selectPublic) || (selectedPrivacyType && selectedPrivacyType.length > 0 && blogText)) {
            return blogText.trim() !== '';
        }
    }
    return false;
};

module.exports = ['$scope', 'FileReader', function ($scope, FileReader) {
    $scope.selectPublic = true;
    $scope.sendBlogAllowed = false;

    $scope.$watch('imageForUpload', function (newImage) {
        if (newImage) {
            FileReader.onloadend = function () {
                $scope.$apply(function () {
                    $scope.imageForUploadPreviewStart = false;
                    $scope.imageForUploadPreview = FileReader.result;
                });
            };
            FileReader.onloadstart = function () {
                $scope.$apply(function () {
                    $scope.imageForUploadPreviewStart = true;
                });
            };
            FileReader.readAsDataURL(newImage);
        }
    });

    $scope.$watch('selectedPrivacyType', function (newPrivacyType) {
        $scope.sendBlogAllowed = isSendBlogAllowed(newPrivacyType,
            $scope.user.blogText, $scope.selectPublic, $scope.imageForUploadPreviewStart);
    });

    $scope.$watch('user.blogText', function (newBlogText) {
        $scope.sendBlogAllowed = isSendBlogAllowed($scope.selectedPrivacyType,
            newBlogText, $scope.selectPublic, $scope.imageForUploadPreviewStart);
    });

    $scope.$watch('selectPublic', function (newSelectPublic) {
        $scope.sendBlogAllowed = isSendBlogAllowed($scope.selectedPrivacyType,
            $scope.user.blogText, newSelectPublic, $scope.imageForUploadPreviewStart);
    });

    $scope.$watch('imageForUploadPreviewStart', function (newImageUpload) {
        $scope.sendBlogAllowed = isSendBlogAllowed($scope.selectedPrivacyType,
            $scope.user.blogText, $scope.selectPublic, newImageUpload);
    });

    $scope.deletePicture = function () {
        $scope.imageForUploadPreview = null;
        $scope.imageForUpload = null;
    };

    $scope.$on('home.blog.abort', function () {
        FileReader.abort();
        $scope.selectPublic = true;
        $scope.imageForUploadPreviewStart = false;
        $scope.imageForUploadPreview = null;
        $scope.imageForUpload = null;
    });
}];

