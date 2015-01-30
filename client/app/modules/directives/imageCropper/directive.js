'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/directives/imageCropper/template.html',
            scope: {
                image: '=',
                getDataToUpload: '=',
                imageResultData: '='
            },
            link: function (scope, element) {
                var $image = $(element.find('img')[0]);
                $image.cropper({
                    aspectRatio: 1,
                    dashed: false,
                    zoomable: false,
                    rotatable: false,
                    done: function (data) {
                    }
                });

                scope.$watch('getDataToUpload', function (newCommand) {
                    if (newCommand) {
                        scope.imageResultData($image.cropper('getDataURL', 'image/jpeg'));
                    }
                });

                scope.$watch('image', function (newImage) {
                    if (newImage) {
                        $image.cropper('reset', true).cropper('replace', newImage);
                    }
                });
            }
        };
    }],
    name: 'elyImageUpload'
};
