'use strict';

module.exports = ['$scope', '$timeout', 'FileReader', 'ElyModal', 'fileUpload', 'errorToast', 'CheckFileFormat',
    function ($scope, $timeout, FileReader, ElyModal, fileUpload, errorToast, CheckFileFormat) {
        var ctrl = this;
        ctrl.commands = {};
        ctrl.hasImage = false;
        ctrl.unsupportedFile = false;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.uploadImage = function () {
            ctrl.running = true;
            ctrl.commands.disable();
            $timeout(ctrl.commands.getData());
        };

        ctrl.startImageUpload = function (blob) {
            if (blob instanceof Blob) {
                fileUpload.uploadFileToUrl(blob, ctrl.uploadUrl).success(function () {
                    ElyModal.hide();
                }).error(function () {
                    ctrl.commands.enable();
                    ctrl.running = false;
                    errorToast.showError('Beim Senden des Bildes ist ein Fehler aufgetreten!');
                });
            } else {
                ctrl.commands.enable();
                ctrl.running = false;
                errorToast.showError('Diese Datei kann nicht hochgeladen werden');
            }
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


