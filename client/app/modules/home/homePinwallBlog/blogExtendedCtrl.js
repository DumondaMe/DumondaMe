'use strict';

var isSendBlogAllowed = function (selectedPrivacyType, blogText, selectPublic, imageLoading) {
    if (!imageLoading) {
        if ((blogText && selectPublic) || (selectedPrivacyType && selectedPrivacyType.length > 0 && blogText)) {
            return blogText.trim() !== '';
        }
    }
    return false;
};

module.exports = ['$scope', 'FileReader', 'fileUpload', 'FileReaderUtil', function ($scope, FileReader, fileUpload, FileReaderUtil) {
    $scope.selectPublic = true;
    $scope.sendBlogAllowed = false;
    $scope.uploadBlogIsRunning = false;

    $scope.$watch('imageForUpload', function (newImage) {
        if (newImage) {
            FileReader.onloadend = function () {
                $scope.$apply(function () {
                    $scope.imageForUploadPreviewStart = false;
                    $scope.imageForUploadPreview = FileReader.result;
                    $scope.imageForUploadPreviewData = FileReaderUtil.dataURItoBlob($scope.imageForUploadPreview);
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

    $scope.sendBlog = function () {
        function getParameters () {
            var params = {addBlog: {text: $scope.user.blogText}}, visibility = [];
            if (!$scope.selectPublic) {
                angular.forEach($scope.selectedPrivacyType, function (type) {
                    visibility.push(type.type);
                });
                params.addBlog.visibility = visibility;
            }
            return params;
        }

        if (!$scope.uploadBlogIsRunning && $scope.sendBlogAllowed) {
            $scope.uploadBlogIsRunning = true;
            fileUpload.uploadFileAndJson($scope.imageForUploadPreviewData, getParameters(), 'api/user/blog').
                success(function () {
                    $scope.uploadBlogIsRunning = false;
                }).
                error(function () {
                    $scope.uploadBlogIsRunning = false;
                    $scope.uploadRunning = false;
                });
        }
    };

    $scope.$on('home.blog.abort', function () {
        if (!$scope.uploadBlogIsRunning) {
            FileReader.abort();
            $scope.selectPublic = true;
            $scope.imageForUploadPreviewStart = false;
            $scope.imageForUploadPreview = null;
            $scope.imageForUpload = null;
        }
    });
}];

