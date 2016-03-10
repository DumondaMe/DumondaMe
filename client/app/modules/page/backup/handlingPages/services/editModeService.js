'use strict';

module.exports = [
    function () {
        var ctrl = this;
        var isEditMode = false;

        ctrl.reset = function () {
            isEditMode = false;
        };

        ctrl.setEditMode = function () {
            isEditMode = true;
        };

        ctrl.isEditMode = function () {
            return isEditMode;
        };

        ctrl.hasChanged = function (newValues, previousValues, elementsToCompare) {
            var compare = {}, previousCompare = {};
            if (isEditMode) {
                angular.forEach(elementsToCompare, function (elementToCompare) {
                    compare[elementToCompare] = newValues[elementToCompare];
                    previousCompare[elementToCompare] = previousValues[elementToCompare];
                });
                return !angular.equals(compare, previousCompare);
            }
            return false;
        };

    }];
