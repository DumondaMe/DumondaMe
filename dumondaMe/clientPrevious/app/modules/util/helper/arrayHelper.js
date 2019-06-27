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

    this.getIndex = function (array, elementToSearch, propertyToCompare) {
        var index = -1;
        if (angular.isArray(array)) {
            array.forEach(function (element, indexOfElement) {
                if (element[propertyToCompare] === elementToSearch[propertyToCompare]) {
                    index = indexOfElement;
                }
            });
        }
        return index;
    };

    this.uniqueArray = function (array, propertyToCompare) {
        var uniqueArray = angular.copy(array);

        if (angular.isArray(uniqueArray)) {
            for (var i = 0; i < uniqueArray.length; ++i) {
                for (var j = i + 1; j < uniqueArray.length; ++j) {
                    if (propertyToCompare) {
                        if (uniqueArray[i][propertyToCompare] === uniqueArray[j][propertyToCompare]) {
                            uniqueArray.splice(j--, 1);
                        }
                    } else {
                        if (uniqueArray[i] === uniqueArray[j]) {
                            uniqueArray.splice(j--, 1);
                        }
                    }

                }
            }
        }
        return uniqueArray;
    };

}];
