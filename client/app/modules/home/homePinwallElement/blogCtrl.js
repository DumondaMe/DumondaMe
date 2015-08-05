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

module.exports = ['$scope', 'dateFormatter', 'PromiseModal', 'Blog',  function ($scope, dateFormatter, PromiseModal, Blog) {

    $scope.getFormattedDate = dateFormatter.formatRelativeTimes;

    setAdminActions($scope);

    $scope.removeBlog = function (blogId) {
        PromiseModal.getModal({
            title: 'Blog l\u00f6schen',
            content: 'Willst Du diesen Blog wirklich l\u00f6schen?',
            templateUrl: 'app/modules/util/dialog/yesNoDialog.html',
            placement: 'center'
        }).show().then(function () {
            Blog.delete({
                blogId: blogId
            }, function () {
                $scope.elementRemoved($scope.element);
                /*delete page.recommendation.user;
                page.recommendation.summary.contact = resp.recommendation.contact;
                page.recommendation.summary.all = resp.recommendation.all;
                $scope.$emit('page.detail.edit');*/
            });
        });
    };
}];

