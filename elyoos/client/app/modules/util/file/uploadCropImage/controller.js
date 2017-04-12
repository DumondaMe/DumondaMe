'use strict';

module.exports = ['$scope', '$timeout', 'FileReader', 'ElyModal', 'fileUpload', 'errorToast', 'FileReaderLoadImage',
    function ($scope, $timeout, FileReader, ElyModal, fileUpload, errorToast, FileReaderLoadImage) {
        var ctrl = this;
        ctrl.commands = {};
        ctrl.hasImage = false;
        ctrl.unsupportedFile = false;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.startUploadImage = function () {
            ctrl.uploadImage();
        };

        ctrl.uploadImage = function () {
            ctrl.running = true;
            ctrl.commands.disable();
            $timeout(ctrl.commands.getData());
        };

        ctrl.startImageUpload = function (blob) {
            if (blob instanceof Blob) {
                fileUpload.uploadFileToUrl(blob, ctrl.uploadUrl).success(function () {
                    ctrl.running = false;
                    if (angular.isFunction(ctrl.finish)) {
                        ctrl.finish();
                    } else {
                        ElyModal.hide();
                    }
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

        ctrl.rotateLeft = function () {
            ctrl.commands.rotate90DegreeLeft();
        };

        ctrl.rotateRight = function () {
            ctrl.commands.rotate90DegreeRight();
        };

        $scope.$watch('imageForUpload', function (newImage) {
            FileReaderLoadImage.loadImage(ctrl, $scope, newImage);
        });
    }
];


