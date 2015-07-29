'use strict';

module.exports = ['$scope', 'FileReader', function ($scope, FileReader) {
    $scope.selectPublic = true;

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

    $scope.$on('home.blog.abort', function () {
        FileReader.abort();
        $scope.selectPublic = true;
        $scope.imageForUploadPreviewStart = false;
        $scope.imageForUploadPreview = null;
        $scope.imageForUpload = null;
    });
}];

