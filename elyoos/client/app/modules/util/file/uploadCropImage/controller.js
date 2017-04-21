'use strict';

module.exports = ['$scope', '$timeout', 'FileReader', 'ElyModal', 'fileUpload', 'errorToast', 'FileReaderLoadImage',
    function ($scope, $timeout, FileReader, ElyModal, fileUpload, errorToast, FileReaderLoadImage) {
        var ctrl = this;
        ctrl.commands = {};
        ctrl.unsupportedFile = false;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.startUploadImage = function () {
            ctrl.uploadImage();
        };

        ctrl.uploadImage = function () {
            ctrl.setRunning(true);
            ctrl.commands.disable();
            $timeout(ctrl.commands.getData());
        };

        ctrl.startImageUpload = function (blob) {
            if (blob instanceof Blob) {
                fileUpload.uploadFileToUrl(blob, ctrl.uploadUrl).success(function () {
                    ctrl.setRunning(false);
                    if (angular.isFunction(ctrl.finish)) {
                        ctrl.finish();
                    } else {
                        ElyModal.hide();
                    }
                }).error(function () {
                    ctrl.commands.enable();
                    ctrl.setRunning(false);
                    errorToast.showError('Beim Senden des Bildes ist ein Fehler aufgetreten!');
                });
            } else {
                ctrl.commands.enable();
                ctrl.setRunning(false);
                errorToast.showError('Diese Datei kann nicht hochgeladen werden');
            }
        };

        ctrl.rotateLeft = function () {
            ctrl.commands.rotate90DegreeLeft();
        };

        ctrl.rotateRight = function () {
            ctrl.commands.rotate90DegreeRight();
        };

        ctrl.setRunning = function(newRunning) {
            ctrl.running = newRunning;
            if(angular.isFunction(ctrl.eventRunning)) {
                ctrl.eventRunning(ctrl.running);
            }
        };

        ctrl.setHasImage = function (newHasImage) {
            ctrl.hasImage = newHasImage;
            if(angular.isFunction(ctrl.eventHasImage)) {
                ctrl.eventHasImage(ctrl.hasImage);
            }
        };

        ctrl.setUnsupportedFile = function (newUnsupportedFile) {
            ctrl.unsupportedFile = newUnsupportedFile;
        };

        $scope.$watch('imageForUpload', function (newImage) {
            FileReaderLoadImage.loadImage($scope, newImage, ctrl.setUnsupportedFile, ctrl.setHasImage,
                ctrl.setRunning, ctrl.commands.setImage);
        });
    }
];


