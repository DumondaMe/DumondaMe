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

        ctrl.imagePreviewFinish = function (blob, dataUri) {
            ctrl.finish(blob, dataUri);
        };

        $scope.$watch('imageForUpload', function (newImage) {
            FileReaderLoadImage.loadImage(ctrl, $scope, newImage);
        });
    }
];
