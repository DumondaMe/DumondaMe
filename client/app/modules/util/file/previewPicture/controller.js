'use strict';


module.exports = ['$scope', 'FileReader', 'CheckFileFormat',
    function ($scope, FileReader, CheckFileFormat) {
        var ctrl = this;
        ctrl.commands = {};
        ctrl.hasImage = false;
        ctrl.unsupportedFile = false;

        ctrl.selected = function () {
            if (ctrl.hasImage) {
                ctrl.commands.getData();
            }
        };

        ctrl.imagePreviewFinish = function (blob, dataUri) {
            ctrl.finish(blob, dataUri);
        };

        $scope.$watch('imageForUpload', function (newImage) {
            if (newImage) {
                FileReader.onloadend = function () {
                    $scope.$apply(function () {
                        ctrl.hasImage = true;
                        ctrl.running = false;
                        ctrl.commands.setImage(FileReader.result);
                    });
                };
                FileReader.onloadstart = function () {
                    $scope.$apply(function () {
                        ctrl.running = true;
                    });
                };
                ctrl.hasImage = false;
                ctrl.unsupportedFile = false;
                if (CheckFileFormat.isValidFileFormat(newImage.name, '.png .jpg .jpeg')) {
                    FileReader.readAsDataURL(newImage);
                } else {
                    ctrl.unsupportedFile = true;
                }

            }
        });
    }
];
