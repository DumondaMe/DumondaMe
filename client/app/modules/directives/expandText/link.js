'use strict';

module.exports = {
    directiveLink: function () {
        return function ($scope, element) {

            $scope.$watch('description', function (newDescription) {
                    var textElement = element.find('#ely-expand-text-description');
                    if (newDescription) {
                        if (textElement.context.scrollHeight > textElement.innerHeight()) {
                            $scope.showExpand = true;
                        }
                    }
                }
            );
        };
    }
};
