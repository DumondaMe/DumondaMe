'use strict';

module.exports = ['$scope', 'Modification', function ($scope, Modification) {

    function setMessageText(modification, scope) {
        if (modification.numberOfMessages === 1) {
            scope.messageText = modification.numberOfMessages + ' neue Meldung';
        } else if (modification.numberOfMessages > 1) {
            scope.messageText = modification.numberOfMessages + ' neue Meldungen';
        } else {
            scope.messageText = '';
        }
    }

    var modification = Modification.get({forceShowModification: true}, function () {
        setMessageText(modification, $scope);
    });

    $scope.$on('message.changed', function (event, numberOfMessages) {
        setMessageText({numberOfMessages: numberOfMessages}, $scope);
    });
}];
