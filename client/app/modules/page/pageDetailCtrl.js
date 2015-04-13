'use strict';

module.exports = ['$scope', '$stateParams', 'PageDetail', function ($scope, $stateParams, PageDetail) {

    $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label});
}];
