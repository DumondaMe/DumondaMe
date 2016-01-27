'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Home', require('./services/home'));
app.factory('Blog', require('./services/blog'));

app.service('HomeScrollRequestResponseHandler', require('./pinwall/scrollRequestResponseHandler'));
app.service('HomePinwallElements', require('./pinwall/pinwallElements'));
app.service('HomePinwall', require('./pinwall/pinwall'));
app.service('HomePinwallHeightCalculator', require('./pinwall/heightCalculator'));
