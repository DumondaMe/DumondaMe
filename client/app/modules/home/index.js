'use strict';

var app = angular.module('elyoosApp');
var directive = require('./directive.js');

app.directive(directive.name, directive.directive);

app.factory('Home', require('./services/home'));
app.factory('Blog', require('./services/blog'));

app.service('HomePinwallElements', require('./pinwall/pinwallElements'));
app.service('HomePinwallHeightCalculator', require('./pinwall/heightCalculator'));
