'use strict';

var checkStateChanged = function (PageCategoryHandler, PageHandlingState) {
    if (PageCategoryHandler.stateChanged()) {
        PageHandlingState.goToState(1);
    } else {
        PageHandlingState.goToPreviousState();
    }
};

var handleEditMode = function($stateParams, PageLoader, ctrl, Languages, PageCategoryHandler, PageHandlingState, PageEditModeService) {
    if ($stateParams.pageId) {
        PageLoader.load($stateParams.label, $stateParams.pageId).then(function () {
            ctrl.categories = PageLoader.getCategories();
            ctrl.title = PageLoader.getTitle();
            ctrl.selectedLanguage = Languages.getLanguage(PageLoader.getLanguage());
            PageCategoryHandler.setSelected(ctrl.categories);
            PageCategoryHandler.setTitle(ctrl.title);
            PageCategoryHandler.setLanguage(ctrl.selectedLanguage);
            PageHandlingState.goToState(3);
        });
        ctrl.isEditMode = true;
        ctrl.isSingleSelectionDisabled = true;
        ctrl.isMultipleSelectionDisabled = true;
        PageEditModeService.setEditMode();
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$stateParams', 'PageLeftNavElements', 'Languages', 'PageCategoryHandler', 'PageHandlingState', 'PageLoader', 'PageEditModeService',
            function ($stateParams, PageLeftNavElements, Languages, PageCategoryHandler, PageHandlingState, PageLoader, PageEditModeService) {
                var ctrl = this;
                ctrl.categories = {};
                ctrl.isEditMode = false;
                ctrl.isSingleSelectionDisabled = false;
                ctrl.isMultipleSelectionDisabled = false;
                ctrl.isFinishDisabled = true;
                ctrl.isLanguageDisabled = false;
                ctrl.languages = Languages.languages;
                ctrl.showContinueButton = true;

                handleEditMode($stateParams, PageLoader, ctrl, Languages, PageCategoryHandler, PageHandlingState, PageEditModeService);

                ctrl.categoriesSelectionChanged = function () {
                    var isDisabled = PageCategoryHandler.categoriesDisabled();
                    ctrl.isFinishDisabled = !PageCategoryHandler.setSelected(ctrl.categories);
                    ctrl.isSingleSelectionDisabled = isDisabled.single;
                    ctrl.isMultipleSelectionDisabled = isDisabled.multiple;
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                ctrl.languageChanged = function () {
                    ctrl.isFinishDisabled = !PageCategoryHandler.setLanguage(ctrl.selectedLanguage);
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                ctrl.titleChanged = function () {
                    ctrl.isFinishDisabled = !PageCategoryHandler.setTitle(ctrl.title);
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                ctrl.categorySelectFinished = function () {
                    PageCategoryHandler.setPreviousState(ctrl.title);
                    PageHandlingState.goToState(2);
                };

                PageHandlingState.registerStateChange(ctrl);
                ctrl.stateChanged = function (state) {
                    ctrl.showContinueButton = state === 1;
                };
            }];
    }
};
