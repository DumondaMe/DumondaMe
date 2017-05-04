'use strict';


module.exports = ['$scope', 'FileReader', 'FileReaderLoadImage',
    function ($scope, FileReader, FileReaderLoadImage) {
        var ctrl = this;
        ctrl.commands = {};
        ctrl.hasImage = false;
        ctrl.unsupportedFile = false;

        if(ctrl.hideCommandButton) {
            ctrl.finishCommand = function () {
                ctrl.selected();
            };
        }

        ctrl.selected = function () {
            if (ctrl.hasImage) {
                ctrl.commands.getData();
            }
        };

        ctrl.rotateLeft = function () {
            ctrl.commands.rotate90DegreeLeft();
        };

        ctrl.rotateRight = function () {
            ctrl.commands.rotate90DegreeRight();
        };

        ctrl.setRunning = function (newRunning) {
            ctrl.running = newRunning;
            if (angular.isFunction(ctrl.eventRunning)) {
                ctrl.eventRunning(ctrl.running);
            }
        };

        ctrl.setHasImage = function (newHasImage) {
            ctrl.hasImage = newHasImage;
            if (angular.isFunction(ctrl.eventHasImage)) {
                ctrl.eventHasImage(ctrl.hasImage);
            }
        };

        ctrl.setUnsupportedFile = function (newUnsupportedFile) {
            ctrl.unsupportedFile = newUnsupportedFile;
        };

        ctrl.imagePreviewFinish = function (blob, dataUri) {
            ctrl.finish(blob, dataUri);
        };

        $scope.$watch('imageForUpload', function (newImage) {
            FileReaderLoadImage.loadImage($scope, newImage, ctrl.setUnsupportedFile, ctrl.setHasImage,
                ctrl.setRunning, ctrl.commands.setImage);
        });
    }
];
