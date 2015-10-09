'use strict';
module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'PageRecommendationAllContact', 'SearchPage', 'PageCategories', 'PopularPages', 'PageLeftNavElements',
            function ($scope, PageRecommendationAllContact, SearchPage, PageCategories, PopularPages, PageLeftNavElements) {

                var ctrl = this;
                ctrl.query = "";
                ctrl.hide = false;

                ctrl.PageRecommendationAllContact = PageRecommendationAllContact;
                ctrl.SearchPage = SearchPage;
                ctrl.PopularPages = PopularPages;
                ctrl.searchPageRequest = {};
                ctrl.popularBooksContact = {initParams: {onlyContacts: true, category: 'Book'}};
                ctrl.popularYoutubeContact = {initParams: {onlyContacts: true, category: 'Youtube'}};
                ctrl.popularBooksAll = {initParams: {onlyContacts: false, category: 'Book'}};
                ctrl.popularYoutubeAll = {initParams: {onlyContacts: false, category: 'Youtube'}};

                $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

                ctrl.searchPage = function (searchValue) {
                    if (searchValue && searchValue.trim().length > 0) {
                        ctrl.hide = true;
                        ctrl.searchPageRequest.startRequested({
                            search: searchValue,
                            isSuggestion: false
                        });
                    } else {
                        ctrl.hide = false;
                    }
                };

            }];
    }
};
