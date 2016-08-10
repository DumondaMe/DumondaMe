'use strict';

module.exports = ['$stateParams', '$state', 'dateFormatter', 'ImageViewService', '$mdDialog', 'Blog', 'errorToast',
    function ($stateParams, $state, dateFormatter, ImageViewService, $mdDialog, Blog, errorToast) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.format;

        ctrl.openImageView = function () {
            ImageViewService.showImage(ctrl.blogDetail.url);
        };

        ctrl.deleteBlog = function () {
            var confirm = $mdDialog.confirm()
                .title("Blog löschen")
                .textContent("Willst Du diesen Blog wirklich löschen?")
                .ariaLabel("Delete Blog")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                Blog.delete({
                    pageId: $stateParams.pageId
                }, function () {
                    $state.go('home');
                }, function () {
                    errorToast.showError("Fehler beim Löschen des Blogs");
                });
            });
        };
    }];

