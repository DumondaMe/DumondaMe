'use strict';

var checkHasDetail = function (text, image) {
    return (angular.isString(text) && text.length > 120) || angular.isString(image);
};

module.exports = ['dateFormatter', '$mdDialog', 'ElyModal', 'Blog', 'errorToast', 'PreviewTextService', 'UserDetailNavigation', 'BlogRecommendation',
    'PinwallBlogService',
    function (dateFormatter, $mdDialog, ElyModal, Blog, errorToast, PreviewTextService, UserDetailNavigation, BlogRecommendation,
              PinwallBlogService) {
        var ctrl = this, hasDetail;

        ctrl.requestRunning = false;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

        ctrl.previewText = PreviewTextService.getPreviewText(ctrl.element.text, 120).text;

        hasDetail = checkHasDetail(ctrl.element.text, ctrl.element.url);

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.isAdmin);
        };

        ctrl.openDetail = function () {
            if (hasDetail) {
                ElyModal.show('HomePinwallBlogDetail', 'app/modules/pinwall/pinwallElement/blog/detail/detail.html', {element: ctrl.element});
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
                ctrl.requestRunning = true;
                Blog.delete({
                    blogId: ctrl.element.blogId
                }, function () {
                    ctrl.requestRunning = false;
                    PinwallBlogService.removeBlog(ctrl.element.blogId);
                }, function () {
                    ctrl.requestRunning = false;
                    errorToast.showError("Fehler beim Löschen des Blogs");
                });
            });
        };

        ctrl.recommendBlog = function () {
            if (!ctrl.requestRunning) {
                ctrl.requestRunning = true;
                BlogRecommendation.save({blogId: ctrl.element.blogId}, function (resp) {
                    ctrl.requestRunning = false;
                    ctrl.element.recommendedByUser = true;
                    ctrl.element.recommendationId = resp.recommendatonId;
                }, function () {
                    ctrl.requestRunning = false;
                    errorToast.showError("Fehler beim Empfehlen des Blogs");
                });
            }
        };

        ctrl.removeRecommendationBlog = function () {
            if (!ctrl.requestRunning) {
                ctrl.requestRunning = true;
                BlogRecommendation.delete({blogId: ctrl.element.blogId, recommendationId: ctrl.element.recommendationId}, function () {
                    ctrl.requestRunning = false;
                    ctrl.element.recommendedByUser = true;
                    delete ctrl.element.recommendationId;
                }, function () {
                    ctrl.requestRunning = false;
                    errorToast.showError("Fehler beim entfernen der Empfehlung des Blogs");
                });
            }
        };
    }];
