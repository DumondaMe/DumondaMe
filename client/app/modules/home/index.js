'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Home', require('./services/home'));
app.factory('Blog', require('./services/blog'));

app.service('HomeLeftNavElements', require('./services/leftNavElements'));
app.service('HomePinwallRequest', require('./pinwall/pinwallRequest'));
app.service('HomePinwallElements', require('./pinwall/pinwallElements'));
app.service('HomePinwall', require('./pinwall/pinwall'));
app.service('HomePinwallHeightCalculator', require('./pinwall/heightCalculator'));

app.service('WatchRootScope', require('./services/watchRootScope'));
