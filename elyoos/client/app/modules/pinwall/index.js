'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.service('PinwallHeightCalculator', require('./services/heightCalculator'));
app.service('PinwallColumnSelector', require('./services/columnSelector'));
app.service('PinwallBlogService', require('./services/pinwallBlog'));
app.service('PinwallScrollRequestResponseHandler', require('./services/scrollRequestResponseHandler'));
app.service('ShowBlogService', require('./services/showBlog'));