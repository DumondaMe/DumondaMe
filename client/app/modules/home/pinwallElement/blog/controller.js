'use strict';

var checkHasDetail = function (text, image) {
    return (angular.isString(text) && text.length > 120) || angular.isString(image);
};

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter', '$mdDialog', 'ElyModal', 'Blog', 'errorToast', 'BlogPreviewTextService', 'UserDetailNavigation',
            function (dateFormatter, $mdDialog, ElyModal, Blog, errorToast, BlogPreviewTextService, UserDetailNavigation) {
                var ctrl = this, hasDetail;

                ctrl.requestBlogDeleteRunning = false;

                ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

                ctrl.previewText = BlogPreviewTextService.getPreviewText(ctrl.element.text);

                hasDetail = checkHasDetail(ctrl.element.text, ctrl.element.url);

                ctrl.openUserDetail = function() {
                    UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
                };

                ctrl.openDetail = function () {
                    if (hasDetail) {
                        ElyModal.show('HomePinwallBlogDetail', 'app/modules/home/pinwallElement/blog/detail/detail.html', {element: ctrl.element});
                    }
                };

                ctrl.deleteBlog = function () {
                    var confirm = $mdDialog.confirm()
                        .title("Blog löschen")
                        .textContent("Willst Du diesen Blog wirklich löschen?")
                        .ariaLabel("Delete Blog")
                        .ok("Löschen")
                        .cancel("Abbrechen");
                    $mdDialog.show(confirm).then(function () {
                        ctrl.requestBlogDeleteRunning = true;
                        Blog.delete({
                            blogId: ctrl.element.blogId
                        }, function () {
                            ctrl.requestBlogDeleteRunning = false;
                            ctrl.onBlogRemoved(ctrl.element.blogId);
                        }, function () {
                            ctrl.requestBlogDeleteRunning = false;
                            errorToast.showError("Fehler beim Löschen des Blogs");
                        });
                    });
                };
            }];
    }
};

