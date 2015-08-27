'use strict';

var containsSelectedElements = function (selected) {
    var isSelected = false;
    angular.forEach(selected, function (value) {
        if (value === true) {
            isSelected = true;
        }
    });
    return isSelected;
};

var isCategoryValid = function (actual) {
    return containsSelectedElements(actual.selected) && actual.title && actual.title.trim() !== "" && actual.language;
};

module.exports = ['Languages',
    function (Languages) {
        var actual = {};
        var previous;
        var singleSelectedItems = ['Book', 'Youtube', 'Video'];

        this.reset = function () {
            actual = {};
            previous = null;
        };

        this.setSelected = function (selectedValues) {
            actual.selected = selectedValues;
            return isCategoryValid(actual);
        };

        this.getSelected = function () {
            var selectedItems = [];
            angular.forEach(actual.selected, function (value, name) {
                if (value === true) {
                    selectedItems.push(name);
                }
            });
            return selectedItems;
        };

        this.setLanguage = function (newLanguage) {
            actual.language = newLanguage;
            return isCategoryValid(actual);
        };

        this.getLanguageCode = function () {
            return Languages.getCode(actual.language);
        };

        this.setTitle = function (newTitle) {
            actual.title = newTitle;
            return isCategoryValid(actual);
        };

        this.setPreviousState = function () {
            previous = angular.copy(actual);
        };

        this.stateChanged = function () {
            if (previous) {
                return actual.title !== previous.title || actual.language !== previous.language || !angular.equals(actual.selected, previous.selected);
            }
            return false;
        };

        this.getTitle = function () {
            return actual.title;
        };

        this.categoriesDisabled = function () {

            function isSingleElement(selectedElement, name) {
                return singleSelectedItems.indexOf(name) !== -1 && selectedElement === true;
            }

            function isMultipleElement(selectedElement, name) {
                return singleSelectedItems.indexOf(name) === -1 && selectedElement === true;
            }

            var isDisabled = {single: false, multiple: false};
            angular.forEach(actual.selected, function (selectedElement, name) {
                if (isSingleElement(selectedElement, name)) {
                    isDisabled = {single: true, multiple: true};
                } else if (isMultipleElement(selectedElement, name)) {
                    isDisabled = {single: true, multiple: false};
                }
            });
            return isDisabled;
        }
    }];
