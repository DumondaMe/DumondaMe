'use strict';
/*This is a temporary bugfix for flex height problem with the safari browser*/

module.exports = {
    compile: function (Bowser) {
        return function (templateElement) {
            templateElement.addClass('layout-column');
            if(!Bowser.safari) {
                templateElement.addClass('flex-auto');
            } else {
                templateElement.addClass('flex');
            }
        };
    }
};
