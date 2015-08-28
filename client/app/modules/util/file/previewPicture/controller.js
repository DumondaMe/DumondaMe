'use strict';


module.exports = ['$scope', '$modalInstance', 'FileReader', 'FileReaderUtil',
    function ($scope, $modalInstance, FileReader, FileReaderUtil) {
        var ctrl = this;

        this.cancel = function () {
            $modalInstance.dismiss();
        };

        this.continue = function () {
            ctrl.commands.getData();
        };

        this.imageResultData = function (data) {
            var blob;
            if (data && angular.isFunction(data.toDataURL)) {
                blob = FileReaderUtil.dataURItoBlob(data.toDataURL("image/jpeg", 1.0));
                $modalInstance.close({preview: data.toDataURL("image/jpeg", 1.0), blob: blob});
            }
        };

        this.commands = {};

        $scope.image = {};
        $scope.image.imageForUpload = null;
        $scope.$watch('image.imageForUpload', function (newImage) {
            if (newImage) {
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.imageForUploadPreview = FileReader.result;
                        ctrl.commands.setImage(FileReader.result);
                    });
                };
                FileReader.readAsDataURL(newImage);
            }
        });
    }];
