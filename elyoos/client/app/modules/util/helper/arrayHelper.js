'use strict';

module.exports = [function () {

    this.removeElement = function (array, propertyId, elementId) {
        var indexToRemove = null;
        if (angular.isArray(array)) {
            angular.forEach(array, function (element, index) {
                if (element[propertyId] === elementId) {
                    indexToRemove = index;
                }
            });
            if (angular.isNumber(indexToRemove)) {
                array.splice(indexToRemove, 1);
            }
        }
    };

    this.removeElementByObject = function (array, elementToRemove) {
        var indexToRemove = null;
        if (angular.isArray(array)) {
            angular.forEach(array, function (element, index) {
                if (element === elementToRemove) {
                    indexToRemove = index;
                }
            });
            if (angular.isNumber(indexToRemove)) {
                array.splice(indexToRemove, 1);
            }
        }
    };

    this.getObjectElement = function (array, uniqueKeyName, uniqueKeyValue) {
        var result = null;
        if (angular.isArray(array)) {
            angular.forEach(array, function (object) {
                if (object[uniqueKeyName] === uniqueKeyValue) {
                    result = object;
                }
            });
        }
        return result;
    };

    this.getObjectElements = function (array, keyName, keyValue) {
        var result = [];
        if (angular.isArray(array)) {
            angular.forEach(array, function (object) {
                if (object[keyName] === keyValue) {
                    result.push(object);
                }
            });
        }
        return result;
    };

    this.setAllObjectProperty = function (array, keyName, keyValue) {
        if (angular.isArray(array)) {
            angular.forEach(array, function (object) {
                object[keyName] = keyValue;
            });
        }
    };

    this.toStringArray = function (array, elementToString) {
        var stringArray = [];
        if (angular.isArray(array)) {
            angular.forEach(array, function (element) {
                stringArray.push(element[elementToString]);
            });
        }
        return stringArray;
    };

}];
