'use strict';

module.exports = {
    directiveLink: function () {
        return function ($scope, element) {

            $scope.$watch('description', function (newDescription) {
                    var textElement = element.find('.ely-expand-text-description');
                    if (newDescription && textElement.length > 0) {
                        if (textElement[0].scrollHeight > textElement[0].clientHeight) {
                            $scope.showExpand = true;
                        }
                    }
                }
            );
        };
    }
};
