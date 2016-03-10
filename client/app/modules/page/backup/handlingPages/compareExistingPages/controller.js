'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['$state', 'PageHandlingState', 'PageCategoryHandler', 'SearchPage',
            function ($state, PageHandlingState, PageCategoryHandler, SearchPage) {
                var ctrl = this;
                ctrl.showPreviews = false;
                ctrl.pageRequest = {};

                ctrl.continue = function () {
                    PageHandlingState.goToState(3);
                };

                ctrl.abortHandlingPage = function () {
                    $state.go('page.overview');
                };

                ctrl.SearchPage = SearchPage;
                PageHandlingState.registerStateChange(ctrl);

                ctrl.stateChanged = function (state) {
                    if (state === 2) {
                        ctrl.pageRequest.startRequested({
                            search: PageCategoryHandler.getTitle(),
                            filterType: PageCategoryHandler.getSelected(),
                            filterLanguage: PageCategoryHandler.getLanguageCode(),
                            isSuggestion: false
                        });
                    } else {
                        ctrl.showPreviews = false;
                    }
                };

                ctrl.pageRequest.requestFinished = function (pages) {
                    if (pages.length > 0) {
                        ctrl.showPreviews = true;
                    } else {
                        ctrl.showPreviews = false;
                        PageHandlingState.goToState(3);
                    }
                };
            }];
    }
};
