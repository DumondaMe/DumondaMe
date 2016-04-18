'use strict';


module.exports = {
    directiveLink: function () {
        return function (scope, elem) {

            elem.bind('click', function () {
                angular.element(document.querySelector('#upload-photo'))[0].click();
            });
        };
    }
};
