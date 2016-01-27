'use strict';

var moment = require('moment');
var secondsDay = 86400;
var secondsWeek = 604800;
var secondsMonth = 2592000;

var isFirst24Hours = function ($scope, index, now) {
    if (index === 0) {
        return $scope.users.contactingUsers[index].userAdded > now - secondsDay;
    }
    return false;
};

var isTransitionDayWeek = function ($scope, index, now) {
    if (index === 0) {
        return $scope.users.contactingUsers[index].userAdded < now - secondsDay &&
            $scope.users.contactingUsers[index].userAdded > now - secondsWeek;
    }
    return $scope.users.contactingUsers[index].userAdded < now - secondsDay &&
        $scope.users.contactingUsers[index].userAdded > now - secondsWeek &&
        $scope.users.contactingUsers[index - 1].userAdded > now - secondsDay;
};

var isTransitionWeekMonth = function ($scope, index, now) {
    if (index === 0) {
        return $scope.users.contactingUsers[index].userAdded < now - secondsWeek &&
            $scope.users.contactingUsers[index].userAdded > now - secondsMonth;
    }
    return $scope.users.contactingUsers[index].userAdded < now - secondsWeek &&
        $scope.users.contactingUsers[index].userAdded > now - secondsMonth &&
        $scope.users.contactingUsers[index - 1].userAdded > now - secondsWeek;
};

var isTransitionMonthLater = function ($scope, index, now) {
    if (index === 0) {
        return $scope.users.contactingUsers[index].userAdded < now - secondsMonth;
    }
    return $scope.users.contactingUsers[index].userAdded < now - secondsMonth &&
        $scope.users.contactingUsers[index - 1].userAdded > now - secondsMonth;
};

var isTransition = function ($scope, index, now) {
    return isFirst24Hours($scope, index, now) || isTransitionDayWeek($scope, index, now) ||
        isTransitionWeekMonth($scope, index, now) || isTransitionMonthLater($scope, index, now);
};

module.exports = ['$scope', 'Contacting', 'ContactLeftNavElements', function ($scope, Contacting, ContactLeftNavElements) {

    $scope.resetCounter = 1;
    $scope.itemsPerPage = 30;

    $scope.getContacting = function (paginationNumber) {

        var skip = (paginationNumber - 1) * $scope.itemsPerPage;

        $scope.users = Contacting.get({itemsPerPage: $scope.itemsPerPage, skip: skip}, function () {
            if (paginationNumber === 1) {
                $scope.resetCounter = $scope.resetCounter + 1;
            }
        });
    };
    $scope.getContacting(1);

    $scope.$emit(ContactLeftNavElements.event, ContactLeftNavElements.elements);

    $scope.showContactingInfo = function (index) {
        var now = Math.floor(moment.utc().valueOf() / 1000);
        return isTransition($scope, index, now);
    };

    $scope.getContactingInfo = function (index) {
        var now = Math.floor(moment.utc().valueOf() / 1000);
        if (isFirst24Hours($scope, index, now)) {
            return 'In den letzten 24 Stunden';
        }
        if (isTransitionDayWeek($scope, index, now)) {
            return 'Vor mehr als 24 Stunden';
        }
        if (isTransitionWeekMonth($scope, index, now)) {
            return 'Vor mehr als eine Woche';
        }
        if (isTransitionMonthLater($scope, index, now)) {
            return 'Vor mehr als 30 Tage';
        }
    };
}];
