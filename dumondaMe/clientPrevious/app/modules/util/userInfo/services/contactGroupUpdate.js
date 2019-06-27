'use strict';

var removeGroup = function (groupToUpdate, newGroup, ArrayHelper) {
    groupToUpdate.forEach(function (group) {
        if (!ArrayHelper.getObjectElement(newGroup, 'group', group.group)) {
            ArrayHelper.removeElementByObject(groupToUpdate, group);
        }
    });
};

var addGroup = function (groupToUpdate, newGroup, ArrayHelper) {
    newGroup.forEach(function (group) {
        if (!ArrayHelper.getObjectElement(groupToUpdate, 'group', group.group)) {
            groupToUpdate.push(angular.copy(group));
        }
    });
};

module.exports = ['ArrayHelper', function (ArrayHelper) {
    var service = this;

    service.update = function (groupToUpdate, newGroup) {
        if (angular.isArray(groupToUpdate) && angular.isArray(newGroup)) {
            removeGroup(groupToUpdate, newGroup, ArrayHelper);
            addGroup(groupToUpdate, newGroup, ArrayHelper);
            groupToUpdate.forEach(function (group) {
                var newCount = ArrayHelper.getObjectElement(newGroup, 'group', group.group).count;
                if (newCount > group.count && angular.isFunction(group.reloadContact)) {
                    group.reloadContact();
                }
                group.count = newCount;
            });
        }
    };

}];
