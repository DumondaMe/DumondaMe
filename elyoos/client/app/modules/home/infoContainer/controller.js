'use strict';

module.exports = ['EventOverview', function (EventOverview) {
    var ctrl = this;

    ctrl.events = EventOverview.get({maxItems: 20, skip: 0});
}];

