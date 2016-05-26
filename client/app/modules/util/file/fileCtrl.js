'use strict';

module.exports = ['$scope', 'fileUpload', 'FileReader', 'FileReaderUtil', function ($scope, fileUpload, FileReader, FileReaderUtil) {

    $scope.image = {
        imageForUploadPreview: null,
        imageForUpload: null
    };
    $scope.uploadRunning = false;
    $scope.uploadFile = false;
    $scope.isLandscape = false;

    $scope.imageResultData = function (data) {
        var blob;
        if (data && data.toDataURL && angular.isFunction(data.toDataURL)) {
            delete $scope.uploadError;
            $scope.uploadRunning = true;
            blob = FileReaderUtil.dataURItoBlob(data.toDataURL("image/jpeg", 1.0));
            if ($scope.uploadFile) {
                fileUpload.uploadFileToUrl(blob, '/api/user/settings/uploadProfileImage').
                    success(function () {
                        $scope.uploadRunning = false;
                        $scope.$emit('elyoos.profileImage.change');
                        $scope.$hide();
                    }).
                    error(function () {
                        $scope.uploadRunning = false;
                    });
            } else {
                $scope.$hide();
                $scope.$emit('image.cropper.image.preview', data, blob);
            }
        } else {
            $scope.uploadError = 'File kann nicht hochgeladen werden';
        }
    };

    $scope.$watch('image.imageForUpload', function (newImage) {
        if (newImage) {
            FileReader.onloadend = function () {
                $scope.$apply(function () {
                    $scope.image.imageForUploadPreview = FileReader.result;
                });
            };
            FileReader.readAsDataURL(newImage);
        }
    });

    $scope.startUpload = function () {
        $scope.uploadFile = true;
        $scope.$broadcast('image.cropper.get.data');
    };

    $scope.getPreview = function () {
        $scope.uploadFile = false;
        $scope.$broadcast('image.cropper.get.data');
    };

    $scope.setFormat = function (ratio, isLandsacpe) {
        $scope.$broadcast('image.cropper.set.ratio', ratio);
        $scope.isLandscape = isLandsacpe;
    };

    $scope.checkOriginalSize = function (width, height) {
        if (width < 184 || height < 300) {
            $scope.$apply(function () {
                $scope.uploadError = 'Bild ist zu klein';
            });
        } else {
            $scope.$apply(function () {
                delete $scope.uploadError;
            });
        }
    };
}];
