'use strict';

var checkStateChanged = function (PageCategoryHandler, PageHandlingState) {
    if (PageCategoryHandler.stateChanged()) {
        PageHandlingState.goToState(1);
    } else {
        PageHandlingState.goToPreviousState();
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['PageLeftNavElements', 'Languages', 'PageCategoryHandler', 'PageHandlingState',
            function (PageLeftNavElements, Languages, PageCategoryHandler, PageHandlingState) {
                this.categories = {};
                this.isSingleSelectionDisabled = false;
                this.isMultipleSelectionDisabled = false;
                this.isFinishDisabled = true;
                this.isLanguageDisabled = false;
                this.languages = Languages.languages;
                this.showContinueButton = true;

                this.categoriesSelectionChanged = function () {
                    this.isFinishDisabled = !PageCategoryHandler.setSelected(this.categories);
                    var isDisabled = PageCategoryHandler.categoriesDisabled();
                    this.isSingleSelectionDisabled = isDisabled.single;
                    this.isMultipleSelectionDisabled = isDisabled.multiple;
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                this.languageChanged = function () {
                    this.isFinishDisabled = !PageCategoryHandler.setLanguage(this.selectedLanguage);
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                this.titleChanged = function () {
                    this.isFinishDisabled = !PageCategoryHandler.setTitle(this.title);
                    checkStateChanged(PageCategoryHandler, PageHandlingState);
                };

                this.categorySelectFinished = function () {
                    PageCategoryHandler.setPreviousState(this.title);
                    PageHandlingState.goToState(2);
                };

                PageHandlingState.registerStateChange(this);
                this.stateChanged = function (state) {
                    this.showContinueButton = state === 1;
                };
            }];
    }
};
