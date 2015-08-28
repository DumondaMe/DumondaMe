'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['$state', 'PageHandlingState', 'PageCategoryHandler', 'SearchPage',
            function ($state, PageHandlingState, PageCategoryHandler, SearchPage) {
                var ctrl = this;
                this.showPreviews = false;
                this.pageRequest = {};

                this.continue = function () {
                    PageHandlingState.goToState(3);
                };

                this.abortHandlingPage = function () {
                    $state.go('page.overview');
                };

                this.SearchPage = SearchPage;
                PageHandlingState.registerStateChange(this);

                this.stateChanged = function (state) {
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

                this.pageRequest.requestFinished = function (pages) {
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
