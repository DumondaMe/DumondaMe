'use strict';

module.exports = ['FileReader', 'CheckFileFormat', function (FileReader, CheckFileFormat) {

    this.loadImage = function ($scope, newImage, setUnsupportedFile, setHasImage, setRunning, setImage) {
        if (newImage) {
            FileReader.onloadend = function () {
                $scope.$apply(function () {
                    setHasImage(true);
                    setRunning(false);
                    setImage(FileReader.result);
                });
            };
            FileReader.onloadstart = function () {
                $scope.$apply(function () {
                    setRunning(true);
                });
            };
            setHasImage(false);
            setUnsupportedFile(false);
            if (CheckFileFormat.isValidFileFormat(newImage.name, '.png .jpg .jpeg')) {
                FileReader.readAsDataURL(newImage);
            } else {
                setUnsupportedFile(true);
            }
        }
    };
}];
