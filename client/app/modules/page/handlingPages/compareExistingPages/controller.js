'use strict';


module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', 'PageHandlingState', 'PageCategoryHandler', 'SearchPage',
            function ($scope, $state, PageHandlingState, PageCategoryHandler, SearchPage) {
                var ctrl = this;
                this.showPreviews = false;
                this.pageRequest = {};

                this.continue = function () {

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

                /*$scope.$on('page.preview.request.finished', function (event, pages) {
                    if (pages.length > 0) {
                        this.showPreviews = true;
                    } else {
                        this.showPreviews = false;
                        PageHandlingState.goToState(3);
                    }
                });*/
            }];
    }
};
