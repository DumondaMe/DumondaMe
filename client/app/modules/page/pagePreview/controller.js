'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', 'Languages', 'PageCategories', 'PromiseModal',
            function ($scope, $state, Languages, PageCategories, PromiseModal) {
                $scope.longFormat = $scope.longFormat === 'true';

                $scope.$watchCollection('pagePreview', function (newValue) {
                    if (newValue) {
                        $scope.pagePreview.languageShow = Languages.getLanguage($scope.pagePreview.language);
                        $scope.pagePreview.labelShow = PageCategories.categories[$scope.pagePreview.label].description;
                    }
                });

                $scope.openDetail = function (pageId, label) {
                    $state.go('page.detail', {
                        label: label,
                        pageId: pageId
                    });
                };

                $scope.showComment = function (contact) {
                    var modalScope = $scope.$new(false);
                    if (contact && contact.hasOwnProperty('comment') && contact.comment.trim() !== "" && contact.hasOwnProperty('url')) {
                        modalScope.contact = contact;
                        PromiseModal.getModal({
                            scope: modalScope,
                            title: 'Kommentar zu ' + $scope.pagePreview.title,
                            template: 'app/modules/page/pagePreview/commentDialog.html',
                            placement: 'center'
                        }).show();
                    }
                };
            }];
    }
};
