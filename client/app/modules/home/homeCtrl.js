'use strict';

module.exports = ['$scope', 'Modification', function ($scope, Modification) {

    var modification = Modification.get({forceShowModification: true}, function () {
        if (modification.numberOfMessages > 0) {
            $scope.messageText = modification.numberOfMessages + ' neue Meldungen';
        }
    });

    $scope.$on('message.changed', function (event, numberOfMessages) {
        $scope.messageText = numberOfMessages + ' neue Meldungen';
    });
}];
