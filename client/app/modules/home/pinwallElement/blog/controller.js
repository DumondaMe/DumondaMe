'use strict';

var getPreviewText = function (text) {
    var previewText = text;
    if (text) {
        if (text.length > 120) {
            previewText = text.substring(0, 120) + "...";
        }
    }
    return previewText;
};

var checkHasDetail = function (text, image) {
    return (angular.isString(text) && text.length > 120) || angular.isString(image);
};

module.exports = {
    directiveCtrl: function () {
        return ['dateFormatter', '$mdDialog', 'Blog', 'errorToast',
            function (dateFormatter, $mdDialog, Blog, errorToast) {
                var ctrl = this, hasDetail;

                ctrl.requestBlogDeleteRunning = false;

                ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;

                ctrl.previewText = getPreviewText(ctrl.element.text);

                hasDetail = checkHasDetail(ctrl.element.text, ctrl.element.url);

                ctrl.openDetail = function () {
                    if (hasDetail) {
                        $mdDialog.show({
                            templateUrl: 'app/modules/home/pinwallElement/blog/detail/detail.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            controller: 'HomePinwallBlogDetail',
                            locals: {element: ctrl.element},
                            bindToController: true,
                            controllerAs: 'ctrl'
                        });
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

