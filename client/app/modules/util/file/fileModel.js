'use strict';

module.exports = {
    directive: ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.elyFileModel),
                    modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });

                scope.$watch(attrs.elyFileModel, function (newValue) {
                    if (newValue === null) {
                        //For reset. Files can be selected again after removing
                        element.val('');
                    }
                });
            }
        };
    }],
    name: 'elyFileModel'
};
