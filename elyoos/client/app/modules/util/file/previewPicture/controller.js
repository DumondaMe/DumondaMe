'use strict';


module.exports = ['$scope', 'FileReader', 'FileReaderLoadImage',
    function ($scope, FileReader, FileReaderLoadImage) {
        var ctrl = this;
        ctrl.commands = {};
        ctrl.hasImage = false;
        ctrl.unsupportedFile = false;

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

        ctrl.imagePreviewFinish = function (blob, dataUri) {
            ctrl.finish(blob, dataUri);
        };

        $scope.$watch('imageForUpload', function (newImage) {
            FileReaderLoadImage.loadImage(ctrl, $scope, newImage);
        });
    }
];
