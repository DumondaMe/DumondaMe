'use strict';

module.exports = [ function () {

    this.removeElement = function (array, propertyId, elementId) {
        var indexToRemove = null;
        angular.forEach(array, function(element, index) {
            if(element[propertyId] === elementId) {
                indexToRemove = index;
            }
        });
        if(angular.isNumber(indexToRemove)) {
            array.splice(indexToRemove, 1);
        }
    };

}];
