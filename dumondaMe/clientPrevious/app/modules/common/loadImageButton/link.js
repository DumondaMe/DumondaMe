'use strict';


module.exports = function (scope, elem) {
    elem.bind('click', function () {
        angular.element(document.querySelector('#upload-photo'))[0].click();
    });
};
