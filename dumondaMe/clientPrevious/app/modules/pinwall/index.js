'use strict';

var app = angular.module('elyoosApp');

app.service('PinwallHeightCalculator', require('./services/heightCalculator'));
app.service('PinwallColumnSelector', require('./services/columnSelector'));
app.service('AddRemovePinwallElementService', require('./services/addRemovePinwallElement'));
app.service('PinwallScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));
app.service('ShowBlogService', require('./services/showBlog'));