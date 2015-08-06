'use strict';

var setAdminActions = function ($scope) {
    $scope.user = {};
    $scope.user.actions = [
        {
            text: "L\u00f6schen",
            click: "removeBlog(element.blogId)"
        },
        {
            text: "Bearbeiten",
            click: "editBlog($scope)"
        }
    ];
};

module.exports = ['$scope', 'dateFormatter', 'PromiseModal', 'Blog', 'WaitingScreen',
    function ($scope, dateFormatter, PromiseModal, Blog, WaitingScreen) {

        $scope.getFormattedDate = dateFormatter.formatRelativeTimes;

        setAdminActions($scope);

        $scope.user.showDetail = false;

        $scope.removeBlog = function (blogId) {
            PromiseModal.getModal({
                title: 'Blog l\u00f6schen',
                content: 'Willst Du diesen Blog wirklich l\u00f6schen?',
                templateUrl: 'app/modules/util/dialog/yesNoDialog.html',
                placement: 'center'
            }).show().then(function () {
                var finished = WaitingScreen.openScreen('Blog wird gel\u00f6scht...');
                Blog.delete({
                    blogId: blogId
                }, function () {
                    $scope.elementRemoved($scope.element);
                    finished();
                }, function () {
                    finished();
                });
            });
        };
    }];

