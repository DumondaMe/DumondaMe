'use strict';

module.exports = ['FileReader', 'CheckFileFormat', function (FileReader, CheckFileFormat) {

    this.loadImage = function (ctrl, $scope, newImage) {
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
    };
}];
