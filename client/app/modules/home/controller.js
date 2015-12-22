'use strict';

var itemsPerPage = 30;
var skip = 0;

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Home', '$mdDialog', 'HomePinwallRequest', function ($scope, Home, $mdDialog, HomePinwallRequest) {
            var ctrl = this;
            ctrl.home = {};

            /*ctrl.home = Home.get({maxItems: itemsPerPage, skip: skip}, function () {
             }, function () {
             });*/

            ctrl.createBlog = function () {
                $mdDialog.show({
                    templateUrl: 'app/modules/home/createBlog/createBlog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    controller: 'HomePinwallCreateBlog',
                    locals: {element: ctrl.element},
                    bindToController: true,
                    controllerAs: 'ctrl'
                });
            };

            ctrl.nextPinwallInfo = function () {
                HomePinwallRequest.requestPinwall(ctrl.home.pinwall).then(function (pinwall) {
                    ctrl.home = pinwall;
                });
            };

            ctrl.nextPinwallInfo();

            /*            ctrl.pinwallItems = {
             numLoaded_: 0,
             toLoad_: 0,
             getItemAtIndex: function(index) {
             if (index > this.numLoaded_) {
             this.fetchMoreItems_(index);
             return null;
             }
             return index;
             },
             // Required.
             // For infinite scroll behavior, we always return a slightly higher
             // number than the previously loaded items.
             getLength: function() {
             return this.numLoaded_ + 5;
             },
             fetchMoreItems_: function(index) {
             if (this.toLoad_ < index) {
             this.toLoad_ += 10;
             $timeout(angular.noop, 300).then(angular.bind(this, function() {
             this.numLoaded_ = this.toLoad_;
             }));
             }
             }
             };*/
        }];
    }
};

