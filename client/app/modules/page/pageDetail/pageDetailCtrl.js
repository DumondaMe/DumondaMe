'use strict';

module.exports = ['$scope', '$window', '$state', '$stateParams', 'PageDetail', 'PageLeftNavElements', 'moment', 'PageCategories',
    function ($scope, $window, $state, $stateParams, PageDetail, PageLeftNavElements, moment, PageCategories) {

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {
            $scope.startLoad = true;
            if ($scope.pageDetail.recommendation && $scope.pageDetail.recommendation.user) {
                $scope.pageDetail.recommendation.user.created = moment.unix($scope.pageDetail.recommendation.user.created).format('LL');
            }
        });

        $scope.category = PageCategories.categories[$stateParams.label].description;
        $scope.pageId = $stateParams.pageId;
        $scope.label = $stateParams.label;

        $scope.openLink = function (link) {
            if (link) {
                $window.open(link, '_blank');
            }
        };

        $scope.openUserDetails = function (userId) {
            $state.go('user.detail', {
                userId: userId
            });
        };

        $scope.getTime = function (time) {
            return moment.unix(time).format('L');
        };

        $scope.goEditPage = function (pageId, label) {
            $state.go('page.edit', {
                pageId: pageId,
                label: label
            });
        };

        $scope.$on('page.detail.edit', function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            $scope.$broadcast('page.detail.edit.child');
        });
    }];
