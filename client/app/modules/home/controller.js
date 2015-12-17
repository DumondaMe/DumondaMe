'use strict';

var itemsPerPage = 30;
var skip = 0;

module.exports = {
    directiveCtrl: function () {
        return ['Home', function (Home) {
            var ctrl = this;

            ctrl.home = Home.get({maxItems: itemsPerPage, skip: skip}, function () {

            }, function () {

            });
        }];
    }
};

