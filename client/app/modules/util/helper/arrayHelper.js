'use strict';

module.exports = [function () {

    this.removeElement = function (array, propertyId, elementId) {
        var indexToRemove = null;
        angular.forEach(array, function (element, index) {
            if (element[propertyId] === elementId) {
                indexToRemove = index;
            }
        });
        if (angular.isNumber(indexToRemove)) {
            array.splice(indexToRemove, 1);
        }
    };

    this.removeElementByObject = function (array, elementToRemove) {
        var indexToRemove = null;
        angular.forEach(array, function (element, index) {
            if (element === elementToRemove) {
                indexToRemove = index;
            }
        });
        if (angular.isNumber(indexToRemove)) {
            array.splice(indexToRemove, 1);
        }
    };

    this.toStringArray = function (array, elementToString) {
        var stringArray = [];
        angular.forEach(array, function (element) {
            stringArray.push(element[elementToString]);
        });
        return stringArray;
    }

}];
