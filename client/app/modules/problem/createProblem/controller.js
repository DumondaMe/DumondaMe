'use strict';

module.exports = ['$scope', 'userInfo', '$mdDialog', 'CreateProblemCheck', 'UploadProblem',
    function ($scope, userInfo, $mdDialog, CreateProblemCheck, UploadProblem) {
        var ctrl = this;
        ctrl.userInfo = userInfo.getUserInfo();

        ctrl.cancel = function () {
            FileReader.abort();
            $mdDialog.cancel();
        };


        ctrl.uploadProblem = function () {
            if (ctrl.sendBlogAllowed && !ctrl.blogUploadStarted) {
                ctrl.blogUploadStarted = true;
                UploadProblem.upload($scope.problemText).then(function (resp) {
                    $mdDialog.hide(resp);
                });
            }
        };

        $scope.$watch('problemText', function (newProblemText) {
            ctrl.sendBlogAllowed = CreateProblemCheck.isSendProblemAllowed(newProblemText);
        });
    }];

