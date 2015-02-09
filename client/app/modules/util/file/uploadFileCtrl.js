'use strict';

function dataURItoBlob(dataURI) {
    var binary = window.atob(dataURI.split(',')[1]),
        test = dataURI.split(',')[1],
        array = [],
        i;
    for (i = 0; i < binary.length; i = i + 1) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

module.exports = ['$scope', 'fileUpload', 'FileReader', function ($scope, fileUpload, FileReader) {

    $scope.imageForUploadPreview = null;
    $scope.uploadRunning = false;

    $scope.imageResultData = function (data) {
        $scope.uploadRunning = true;
        fileUpload.uploadFileToUrl(dataURItoBlob(data), '/api/user/settings/uploadProfileImage').
            success(function () {
                $scope.uploadRunning = false;
                $scope.$emit('elyoos.profileImage.change');
                $scope.$hide();
            }).
            error(function () {
                $scope.uploadRunning = false;
            });
    };

    $scope.$watch('imageForUpload', function (newImage) {
        if (newImage) {
            FileReader.onloadend = function () {
                $scope.$apply(function () {
                    $scope.imageForUploadPreview = FileReader.result;
                });
            };
            FileReader.readAsDataURL(newImage);
        }
    });

    $scope.startUpload = function () {
        if ($scope.updateImageResult) {
            $scope.updateImageResult += 1;
        } else {
            $scope.updateImageResult = 1;
        }
    };
}];
