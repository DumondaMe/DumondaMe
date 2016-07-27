'use strict';

module.exports = ['BlogDetail', '$stateParams', '$state', 'dateFormatter', 'ImageViewService', '$mdDialog', 'Blog', 'errorToast',
    function (BlogDetail, $stateParams, $state, dateFormatter, ImageViewService, $mdDialog, Blog, errorToast) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.format;

        ctrl.blogDetail = BlogDetail.get({blogId: $stateParams.blogId});

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
                    blogId: $stateParams.blogId
                }, function () {
                    $state.go('home');
                }, function () {
                    errorToast.showError("Fehler beim Löschen des Blogs");
                });
            });
        };
    }];

