'use strict';

var setSelected = function (array, selectedArray) {
    if(angular.isArray(array) && angular.isArray(selectedArray)) {
        selectedArray.forEach(function(selected) {
            array.forEach(function(element) {
                if(element.code === selected.code) {
                    element.isSelected = true;
                }
            });
        });
    }
};

module.exports = ['ElyModal', 'HomeScreenFilter', 'Topics', 'Languages', 'RecommendationTypes', 'ArrayHelper',
    function (ElyModal, HomeScreenFilter, Topics, Languages, RecommendationTypes, ArrayHelper) {
        var ctrl = this;

        ctrl.filters = HomeScreenFilter.getFilters();
        ctrl.actualFilterSetting = angular.copy(ctrl.filters);
        ctrl.actualFilterSettingEqual = true;
        ctrl.getObjectElement = ArrayHelper.getObjectElement;

        ctrl.topics = angular.copy(Topics.topics);
        ctrl.languages = Languages.languages;
        ctrl.recommendationTypes = angular.copy(RecommendationTypes.recommendationTypes);
        setSelected(ctrl.topics, ctrl.filters.selectedTopics);
        setSelected(ctrl.recommendationTypes, ctrl.filters.selectedRecommendationTypes);

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.dataChanged = function () {
            ctrl.filters.selectedTopics = ArrayHelper.getObjectElements(ctrl.topics, 'isSelected', true);
            ctrl.filters.selectedRecommendationTypes = ArrayHelper.getObjectElements(ctrl.recommendationTypes, 'isSelected', true);
            ctrl.actualFilterSettingEqual = angular.equals(ctrl.filters, ctrl.actualFilterSetting);
        };

        ctrl.resetFilters = function () {
            ctrl.filters = {onlyContact: false};
            ArrayHelper.setAllObjectProperty(ctrl.topics, 'isSelected', false);
            ArrayHelper.setAllObjectProperty(ctrl.recommendationTypes, 'isSelected', false);
            ctrl.actualFilterSettingEqual = angular.equals(ctrl.filters, ctrl.actualFilterSetting);
        };

        ctrl.filterHomeScreen = function () {
            HomeScreenFilter.filtersChanged(ctrl.filters);
            ElyModal.hide();
        };
    }];

