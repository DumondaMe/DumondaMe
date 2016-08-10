'use strict';

module.exports = ['dateFormatter', '$mdDialog', 'Blog', 'UserPage', 'errorToast', 'PreviewTextService', 'UserDetailNavigation', 'BlogRecommendation',
    'PinwallBlogService',
    function (dateFormatter, $mdDialog, Blog, UserPage, errorToast, PreviewTextService, UserDetailNavigation, BlogRecommendation,
              PinwallBlogService) {
        var ctrl = this;

        ctrl.requestRunning = false;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.previewText = PreviewTextService.getPreviewText(ctrl.element.text, 120).text;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
        };

        ctrl.deleteBlog = function () {
            var confirm = $mdDialog.confirm()
                .title("Blog löschen")
                .textContent("Willst Du diesen Blog wirklich löschen?")
                .ariaLabel("Delete Blog")
                .ok("Löschen")
                .cancel("Abbrechen");
            $mdDialog.show(confirm).then(function () {
                ctrl.requestRunning = true;
                UserPage.delete({
                    pageId: ctrl.element.pageId
                }, function () {
                    ctrl.requestRunning = false;
                    PinwallBlogService.removePinwallElement();
                }, function () {
                    ctrl.requestRunning = false;
                    errorToast.showError("Fehler beim Löschen des Blogs");
                });
            });
        };
    }];
